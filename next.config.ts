import { withPayload } from '@payloadcms/next/withPayload';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig = {
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
      hmrRefreshes: process.env.NODE_ENV === 'development',
    },
  },
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  cacheComponents: true,
  images: {
    minimumCacheTTL: 43200,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
      },
      { protocol: 'https', hostname: '*.instagram.*' },
    ],
    qualities: [25, 50, 75, 80, 95],
    deviceSizes: [320, 640, 750, 1080, 1200, 2048],
  },
  experimental: {
    taint: true,
    turbopackFileSystemCacheForDev: true,
    inlineCss: process.env.NODE_ENV !== 'production', // wait to be out of beta before enabling this in production
  },
  serverExternalPackages: [],
  staticPageGenerationTimeout: 120,
  productionBrowserSourceMaps: false,
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
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'Permissions-Policy', value: 'camera=(),microphone=()' },
        ],
      },
    ];
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
