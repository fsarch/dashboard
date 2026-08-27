/**
 * Next.js instrumentation hook (https://nextjs.org/docs/app/guides/instrumentation):
 * `register()` runs once, before the rest of the app handles any request, in
 * both the Node.js and edge runtime. OpenTelemetry's NodeSDK needs the Node.js
 * `http`/`undici` modules, so it's only initialized for `NEXT_RUNTIME === 'nodejs'`.
 *
 * Distributed tracing itself stays off unless enabled via the `tracing`
 * section of `config.yml` - see docs/tracing.md.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  const { initializeTracing, registerShutdownHandler } = await import("@/utils/tracing/tracing");

  const tracingEnabled = await initializeTracing();

  if (tracingEnabled) {
    registerShutdownHandler();
  }
}
