This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Distributed Tracing (OpenTelemetry)

Distributed tracing is off by default. Enable it via the `tracing` section of `config.yml` — no code changes required (this mirrors the `tracing` config used by [`fsarch/server`](https://github.com/fsarch/server), so the dashboard and the backend services it talks to can export to the same collector):

```yaml
tracing:
  enabled: true
  serviceName: dashboard # optional, defaults to the `name` in package.json
  sampler: parentbased_traceidratio # optional, defaults to traceidratio
  sampleRatio: 1.0 # optional, 0.0 - 1.0, defaults to 1.0
  exporter:
    type: otlp-http # console | otlp-http | otlp-grpc
    url: http://localhost:4318/v1/traces
    headers:
      Authorization: Bearer secret
```

It traces incoming requests to the Next.js server as well as outgoing `fetch()` calls to backend services (e.g. every `fetchService` call), so a request and the backend calls it triggers show up correlated in the same trace. Prefer `sampler: parentbased_traceidratio` over the default `traceidratio` if backend services may run a different `sampleRatio` — otherwise a trace can be sampled here but dropped downstream (or vice versa), making linked requests look unrelated. See [docs/tracing.md](docs/tracing.md) for exporter options, the full sampler list and how to add custom spans.

## Project Documentation

- [GeneratedForm Documentation](src/components/universals/forms/generated/README.md) - Complete guide to using the declarative form component
- [Distributed Tracing](docs/tracing.md) - Enabling OpenTelemetry tracing via `config.yml`, custom spans
