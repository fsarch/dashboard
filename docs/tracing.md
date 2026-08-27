# Distributed Tracing (OpenTelemetry)

Distributed tracing is off by default. Enable it via the `tracing` section
of `config.yml` — no code changes required. This mirrors the `tracing`
config used by [`fsarch/server`](https://github.com/fsarch/server), so a
dashboard instance and the backend services it talks to can be configured
to export spans to the same collector.

It instruments:

- the Next.js Node.js server's incoming HTTP requests (pages, route handlers,
  server actions), and
- outgoing `fetch()` calls made from server code — most importantly every
  call `fetchService` (`src/utils/fetchService.ts`) makes to a backend
  service — so a request into the dashboard and the backend calls it triggers
  end up correlated in the same trace.

It only runs in the Node.js runtime (`process.env.NEXT_RUNTIME === 'nodejs'`);
the Edge runtime (proxy/middleware) is unaffected.

## Configuration

```yaml
tracing:
  enabled: true
  serviceName: dashboard # defaults to the `name` field in package.json
  sampler: parentbased_traceidratio # optional, this is the default - see "Sampler" below
  sampleRatio: 1.0 # 0.0 - 1.0, defaults to 1.0 (trace everything)
  exporter:
    type: otlp-http
    url: http://localhost:4318/v1/traces
    headers:
      Authorization: Bearer secret
```

Like the rest of `config.yml`, this requires a restart of the dev/prod server
to take effect (`configuration.utils.ts` caches the parsed config per
process).

Supported exporters (`exporter.type`):

- `console` — prints spans to stdout, useful for local debugging
- `otlp-http` — sends spans to an OTLP/HTTP collector (e.g. an OTel
  Collector, Grafana Tempo, Honeycomb)
- `otlp-grpc` — sends spans to an OTLP/gRPC collector

`otlp-http`/`otlp-grpc` require `url`; `headers` is optional on both.

### Sampler

`sampler` (`TTracingSamplerType`) selects the sampling strategy, following
the standard OpenTelemetry `OTEL_TRACES_SAMPLER` values:

- `always_on` — sample every span.
- `always_off` — sample no spans (SDK stays initialized, but nothing is
  exported).
- `traceidratio` — makes an independent, deterministic decision per trace ID
  using `sampleRatio`, *regardless of what an incoming `traceparent` header
  says*.
- `parentbased_always_on` / `parentbased_always_off` / `parentbased_traceidratio`
  — **`parentbased_traceidratio` is the default.** These respect an incoming
  (valid) parent span's sampled flag; only fall back to
  `always_on`/`always_off`/`traceidratio` respectively when there is no
  parent (i.e. for the request that starts a new trace).

**Why this matters across services:** with plain `traceidratio`, each fsarch
service in a call chain samples the same trace ID independently. If the
dashboard and a backend service (e.g. `frontier`) don't run the exact same
`sampleRatio`, a trace can end up sampled (and exported) on one side but
dropped on the other — which looks like the backend's request was never
linked to the dashboard's trace, when really the dashboard just correctly
sent a `traceparent` header the backend chose not to sample. The default,
`parentbased_traceidratio`, avoids that by making the dashboard's own
sampling decisions follow an incoming parent trace — `fsarch/server` uses
the exact same option (name, values, and default), so as long as both sides
leave `sampler` on its default, spans stay linked end-to-end regardless of
`sampleRatio` differences between services.

## Implementation

- `src/instrumentation.ts` — Next.js's [instrumentation
  hook](https://nextjs.org/docs/app/guides/instrumentation). Its `register()`
  is called once, before the server handles any request, and starts the
  OpenTelemetry `NodeSDK` if `tracing.enabled` is `true`. It also flushes
  spans on `SIGTERM`/`SIGINT` (e.g. when Docker stops the container) via
  `registerShutdownHandler()`.
- `src/utils/tracing/tracing.ts` — `initializeTracing()`, `shutdownTracing()`,
  `registerShutdownHandler()`, `getTracer()`, `withSpan()`.
- `src/utils/tracing/tracing-config.validator.ts` — Joi schema the parsed
  `tracing` config is validated against before the SDK starts.
- `src/utils/configuration.type.ts` — `TTracingConfiguration` and friends;
  `TConfiguration.tracing` is optional.

## Custom spans

`getTracer()`/`withSpan()` work regardless of whether tracing is enabled —
with no SDK started, spans are simply no-ops, so it's safe to sprinkle these
into service-layer code unconditionally.

To trace a block of code (e.g. inside a service function or a specific
branch), use `withSpan()`:

```ts
import { withSpan } from "@/utils/tracing/tracing";

const claims = await withSpan("claims.enrich", () => enrichClaims(claims));
```

For raw access to the OpenTelemetry API (e.g. to add attributes to the
current active span), use `getTracer()`:

```ts
import { getTracer } from "@/utils/tracing/tracing";

const tracer = getTracer();

await tracer.startActiveSpan("do-something", async (span) => {
  try {
    // ...
  } finally {
    span.end();
  }
});
```
