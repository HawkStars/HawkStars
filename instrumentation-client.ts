// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://37955a36d85d074a03020f4e94df7644@o4510748769452032.ingest.de.sentry.io/4510748771942480',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampler: ({ name, inheritOrSampleWith }) => {
    // Do not sample health checks ever
    if (name.includes('healthcheck')) return 0;

    // These are important - take a big sample
    if (name.includes('auth')) return 1;

    // These are less important or happen much more frequently - only take 1%
    if (name.includes('comment')) return 0.01;

    // Otherwise, inherit the sample sampling decision of the incoming trace, or use a fallback sampling rate.
    return inheritOrSampleWith(0.5);
  },

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 0.1,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  integrations: [],
  enabled: process.env.NODE_ENV != 'development',
});

if (typeof window !== 'undefined') {
  Sentry.lazyLoadIntegration('replayIntegration')
    .then((replayIntegration) => {
      Sentry.addIntegration(
        replayIntegration({
          maskAllText: false,
          blockAllMedia: true,
        })
      );
    })
    .catch(() => {
      // Non-fatal: Replay is a nice-to-have, not core error reporting.
    });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
