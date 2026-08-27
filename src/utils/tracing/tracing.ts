import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  ConsoleSpanExporter,
  TraceIdRatioBasedSampler,
  type SpanExporter,
} from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter as OTLPTraceExporterHttp } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPTraceExporter as OTLPTraceExporterGrpc } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Metadata } from "@grpc/grpc-js";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  trace,
  SpanStatusCode,
  type Span as OtelSpan,
  type Tracer,
} from "@opentelemetry/api";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { getConfiguration } from "@/utils/configuration.utils";
import { TTracingExporterConfiguration } from "@/utils/configuration.type";
import { ServerLogger } from "@/utils/ServerLogger";
import { TRACING_CONFIG_VALIDATOR } from "./tracing-config.validator";
import packageJson from "../../../package.json";

const DEFAULT_TRACER_NAME = 'dashboard';

let sdk: NodeSDK | undefined;

function createExporter(exporterConfig: TTracingExporterConfiguration): SpanExporter {
  switch (exporterConfig.type) {
    case 'console':
      return new ConsoleSpanExporter();
    case 'otlp-http':
      return new OTLPTraceExporterHttp({
        url: exporterConfig.url,
        headers: exporterConfig.headers,
      });
    case 'otlp-grpc': {
      const metadata = new Metadata();
      for (const [key, value] of Object.entries(exporterConfig.headers ?? {})) {
        metadata.set(key, value);
      }

      return new OTLPTraceExporterGrpc({
        url: exporterConfig.url,
        metadata,
      });
    }
    default:
      throw new Error(
        `Tracing exporter type unknown: ${(exporterConfig as { type: string }).type}`,
      );
  }
}

/**
 * Reads the `tracing` section of `config.yml` and, if enabled, starts the
 * OpenTelemetry NodeSDK with instrumentation for the HTTP server and outgoing
 * fetch (undici) calls made e.g. via `fetchService`.
 *
 * Called once from `src/instrumentation.ts`'s `register()` hook, i.e. before
 * the rest of the Next.js server has handled any request, so instrumentation
 * gets to patch `http`/`undici` before they are actually used.
 *
 * Safe to call multiple times: it only ever starts the SDK once.
 *
 * @returns `true` if tracing was started, `false` if it is disabled/not configured.
 */
export async function initializeTracing(): Promise<boolean> {
  if (sdk) {
    return true;
  }

  const configuration = await getConfiguration();
  const tracingConfig = configuration.tracing;

  if (!tracingConfig?.enabled) {
    return false;
  }

  const valid = TRACING_CONFIG_VALIDATOR.validate(tracingConfig, {
    abortEarly: false,
  });
  if (valid.error) {
    ServerLogger.Instance.error('invalid tracing config', { error: valid.error });
    throw new Error('invalid tracing config');
  }

  const serviceName = tracingConfig.serviceName ?? packageJson.name;

  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
      [ATTR_SERVICE_VERSION]: packageJson.version,
    }),
    traceExporter: createExporter(tracingConfig.exporter as TTracingExporterConfiguration),
    sampler: new TraceIdRatioBasedSampler(tracingConfig.sampleRatio ?? 1),
    instrumentations: [
      // Traces incoming requests handled by the Next.js node server.
      new HttpInstrumentation(),
      // Traces outgoing fetch() calls (e.g. fetchService -> backend services),
      // which Next.js/Node serve via undici rather than the http module.
      new UndiciInstrumentation(),
    ],
  });

  sdk.start();

  ServerLogger.Instance.log('tracing initialized', { serviceName });

  return true;
}

/**
 * Flushes and shuts down the tracing SDK, if it was started. Hooked into
 * `SIGTERM`/`SIGINT` by `src/instrumentation.ts` so spans are flushed before
 * the process exits.
 */
export async function shutdownTracing(): Promise<void> {
  if (!sdk) {
    return;
  }

  const instance = sdk;
  sdk = undefined;
  await instance.shutdown();
}

/**
 * Flushes spans instead of dropping them when the process is stopped (e.g.
 * Docker sending SIGTERM). Kept in this module - rather than in
 * `src/instrumentation.ts` directly - so `process.exit`/`process.once` (both
 * unavailable in the Edge Runtime) only end up in the Node.js-only bundle
 * behind the dynamic `import()` in `register()`.
 */
export function registerShutdownHandler(): void {
  let shuttingDown = false;
  const shutdownHandler = () => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;

    shutdownTracing()
      .catch((error) => {
        ServerLogger.Instance.error('failed to flush tracing spans on shutdown', { error });
      })
      .finally(() => {
        process.exit(0);
      });
  };

  process.once('SIGTERM', shutdownHandler);
  process.once('SIGINT', shutdownHandler);
}

/**
 * Returns a tracer for creating custom spans in application code. Works
 * regardless of whether tracing is enabled: with no SDK started, spans are
 * simply no-ops.
 */
export function getTracer(name: string = DEFAULT_TRACER_NAME): Tracer {
  return trace.getTracer(name);
}

function finishSpan(span: OtelSpan, error?: unknown): void {
  if (error !== undefined) {
    span.recordException(error instanceof Error ? error : new Error(String(error)));
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : String(error),
    });
  } else {
    span.setStatus({ code: SpanStatusCode.OK });
  }

  span.end();
}

/**
 * Runs `fn` inside a new active span called `name`, recording exceptions and
 * setting the span status. Works for both sync and async (Promise-returning) `fn`.
 * Safe to use even when tracing is disabled: spans are simply no-ops.
 *
 * @example
 * ```typescript
 * const claims = await withSpan('claims.enrich', () => enrichClaims(claims));
 * ```
 */
export function withSpan<T>(
  name: string,
  fn: (span: OtelSpan) => T,
  options?: { tracerName?: string; attributes?: Record<string, string | number | boolean> },
): T {
  const tracer = getTracer(options?.tracerName);

  return tracer.startActiveSpan(name, (span) => {
    if (options?.attributes) {
      span.setAttributes(options.attributes);
    }

    try {
      const result = fn(span);

      if (result instanceof Promise) {
        return result.then(
          (value) => {
            finishSpan(span);
            return value;
          },
          (error) => {
            finishSpan(span, error);
            throw error;
          },
        ) as T;
      }

      finishSpan(span);
      return result;
    } catch (error) {
      finishSpan(span, error);
      throw error;
    }
  });
}
