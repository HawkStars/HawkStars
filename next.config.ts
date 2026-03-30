import { withPayload } from '@payloadcms/next/withPayload';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const cspHeader = `
    default-src 'self';
    script-src 'self' blob: https://www.googletagmanager.com https://upload-widget.cloudinary.com https://www.instagram.com/embed.js 'unsafe-inline';
    style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
    img-src 'self' blob: data: www.googletagmanager.com https://*.unsplash.com https://*.cdninstagram.com https://*.cloudinary.com https://*.googleapis.com https://*.gstatic.com *.google.com *.googleusercontent.com;
    font-src 'self' https://fonts.gstatic.com data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    block-all-mixed-content;
    upgrade-insecure-requests;
    frame-src 'self' *.google.com https://www.instagram.com/ https://upload-widget.cloudinary.com;
    connect-src 'self' *.google-analytics.com *.de.sentry.io ${process.env.NODE_ENV == 'production' ? `https://*.googleapis.com *.google.com https://*.gstatic.com data: blob:` : 'http://127.0.0.1:54321'};
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
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  // cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    qualities: [50, 75, 80, 100],
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  experimental: {
    taint: true,
    turbopackFileSystemCacheForDev: true,
    inlineCss: true,
  },
  serverExternalPackages: [],
  staticPageGenerationTimeout: 120,
  productionBrowserSourceMaps: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.hawkstars.org',
          },
        ],
        destination: 'https://hawkstars.org/:path*',
        permanent: true,
      },
    ];
  },
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
  // Optimize webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
        },
      };
    }
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   '@': __dirname,
    // };
    return config;
  },
} as NextConfig;

const payloadConfig = withPayload(nextConfig);

export default withSentryConfig(payloadConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'hawkstars',

  project: 'website',

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

  webpack: {
    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
