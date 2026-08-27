import * as Sentry from '@sentry/nextjs';
import * as SentryNode from '@sentry/node';

/**
 * `@sentry/nextjs`'s `Sentry.init()` only runs through `instrumentation.ts`,
 * which Next.js calls on server boot. Code that also runs from bare Payload
 * CLI scripts (`payload migrate`, seed jobs, cron tasks, etc.) executed with
 * `tsx` never goes through that boot path, so in that context
 * `@sentry/nextjs`'s exported `Sentry` object has no active client and
 * calling its capture methods throws (`TypeError: ... is not a function`)
 * instead of safely no-op'ing.
 *
 * These wrappers detect that case via `Sentry.getClient()` and, only when
 * nothing is active, lazily start a plain `@sentry/node` client mirroring
 * `sentry.server.config.ts`'s config — so telemetry from CLI contexts
 * actually reaches Sentry instead of being silently dropped or crashing the
 * caller. When a Next-managed client IS active (normal server/request
 * context), these just delegate to it unchanged.
 *
 * We call through `SentryNode.captureException`/`captureMessage` (not
 * `Sentry.*`) once the fallback client is started, because that fallback
 * client was created via `@sentry/node`'s own `init()` — routing the
 * capture through the same module guarantees it finds the client it just
 * created, regardless of whether `@sentry/nextjs` and `@sentry/node`
 * happen to share an underlying `@sentry/core` module instance.
 */

const SENTRY_DSN =
  'https://37955a36d85d074a03020f4e94df7644@o4510748769452032.ingest.de.sentry.io/4510748771942480';

let nodeClientInitialized = false;

function ensureNodeClient() {
  if (nodeClientInitialized) {
    return;
  }
  nodeClientInitialized = true;
  SentryNode.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
    enabled: process.env.NODE_ENV === 'production',
    sendDefaultPii: false,
  });
}

function captureException(error: unknown, extra?: Parameters<typeof Sentry.captureException>[1]) {
  try {
    if (Sentry.getClient()) {
      Sentry.captureException(error, extra);
      return;
    }
    ensureNodeClient();
    SentryNode.captureException(error, extra);
  } catch {
    // Telemetry must never crash or mask the original error being reported.
  }
}

function captureMessage(message: string) {
  try {
    if (Sentry.getClient()) {
      Sentry.captureMessage(message);
      return;
    }
    ensureNodeClient();
    SentryNode.captureMessage(message);
  } catch {
    // see captureException
  }
}

export { captureException, captureMessage };
