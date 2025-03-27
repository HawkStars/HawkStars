const { withSentryConfig } = require('@sentry/nextjs');

const cspHeader = `
    default-src 'self';
    script-src 'self' blob: https://www.googletagmanager.com https://upload-widget.cloudinary.com 'unsafe-inline';
    style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
    img-src 'self' blob: data: www.googletagmanager.com https://*.cloudinary.com https://*.googleapis.com https://*.gstatic.com *.google.com *.googleusercontent.com;
    font-src 'self' https://fonts.gstatic.com data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors *.sanity.studio;
    block-all-mixed-content;
    upgrade-insecure-requests;
    frame-src *.google.com https://upload-widget.cloudinary.com;
    connect-src 'self' *.api.sanity.io *.google-analytics.com *.sentry.io ${process.env.NODE_ENV == 'production' ? `https://*.googleapis.com *.google.com https://*.gstatic.com data: blob:` : 'http://127.0.0.1:54321'};
`;

const prepCSPHeader =
  process.env.NODE_ENV == 'production'
    ? {
        key: 'Content-Security-Policy',
        value: cspHeader.replace(/\n/g, ''),
      }
    : { key: 'test', value: 'test' };

const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    taint: true,
    turbo: { resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'] },
  },
  staticPageGenerationTimeout: 120,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin',
          },
          { key: 'Permissions-Policy', value: 'camera=(),microphone=()' },
          prepCSPHeader,
        ],
      },
    ];
  },
};

// Injected content via Sentry wizard below
module.exports = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'paulo-goncalves-cardoso',
  project: 'hawk-stars',
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});

// https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
