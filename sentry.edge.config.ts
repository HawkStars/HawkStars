// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const DENY_URLS = [
  // Chrome extensions
  /extensions\//i,
  /^chrome:\/\//i,
  /^chrome-extension:\/\//i,
  /^moz-extension:\/\//i,

  // Facebook
  /graph\.facebook\.com/i,

  // Ad scripts
  /doubleclick\.net/i,
  /googleadservices\.com/i,
  /ofgreencolumn\.com/,

  // Google Tag Manager - errors here are from ad blockers
  /googletagmanager\.com/i,
  /google-analytics\.com/i,
  /googlesyndication\.com/i,
];

const IGNORE_ERRORS = [
  // Browser extensions
  'top.GLOBALS',
  'originalCreateNotification',
  'canvas.contentDocument',

  // Generic cross-origin errors (no actionable info)
  /^Script error\.?$/,

  // Benign browser warnings
  'ResizeObserver loop',

  // Old Facebook SDK
  'fb_xd_fragment',

  // Safari/WebKit quirks
  /The operation couldn't be completed/,

  // Stale chunks after deployment — handled by auto-reload below
  /Importing a module script failed/,
  /Failed to fetch dynamically imported module/,
  /error loading dynamically imported module/i,

  // Random bot/extension noise
  'Non-Error promise rejection captured',
  /cepolygon/,

  // MetaMask / crypto wallet extensions (PRODUCTS-V3-4J, 1M5, 18Q)
  'window.ethereum',
  'Failed to connect to MetaMask',

  // Safari throttles history.replaceState to 100 calls/30s.
  // ScrollRestoration + Sentry tracing + GTM exceed this on fast scroll.
  /history\.replaceState/,

  // Keyboard API blocked in iframes / by Permissions-Policy (third-party scripts)
  /getLayoutMap/,
];

Sentry.init({
  dsn: 'https://37955a36d85d074a03020f4e94df7644@o4510748769452032.ingest.de.sentry.io/4510748771942480',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  enabled: process.env.NODE_ENV === 'production',
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Add this to prevent issues with prerendering
  beforeSend(event) {
    // Don't send events during build/prerender
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return null;
    }
    return event;
  },

  denyUrls: DENY_URLS,
  ignoreErrors: IGNORE_ERRORS,
});
