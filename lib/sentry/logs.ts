import * as Sentry from '@sentry/nextjs';

const captureSentryMessage = (message: string, level: Sentry.SeverityLevel) => {
  Sentry.captureMessage(message, { level });
};

export { captureSentryMessage };
