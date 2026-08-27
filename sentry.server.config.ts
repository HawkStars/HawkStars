// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://37955a36d85d074a03020f4e94df7644@o4510748769452032.ingest.de.sentry.io/4510748771942480',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1,

  enabled: process.env.NODE_ENV === 'production',
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Was `true` with no beforeSend scrubbing — that ships visitor IPs, cookies,
  // and request headers to Sentry's third-party ingest on every event, with
  // no disclosure anywhere in the site's privacy copy. Off until there's an
  // actual documented lawful basis for sending that data to a sub-processor.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  // Add this to prevent issues with prerendering
  beforeSend(event) {
    // Don't send events during build/prerender
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return null;
    }
    return event;
  },

  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
});
