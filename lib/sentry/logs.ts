import * as Sentry from '@sentry/nextjs';

const captureSentryMessage = (
  message: string,
  level: Sentry.SeverityLevel,
  extra?: Record<string, unknown>
) => {
  Sentry.captureMessage(message, { level, extra });
};

export { captureSentryMessage };
