import { withPayload } from '@payloadcms/next/withPayload';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// Static, nonce-free Content-Security-Policy.
//
// Why no nonce: Next.js can only inject a per-request nonce while a document is
// server-rendered for a real request. Prerendered/PPR shells are built with no
// request, so they carry no nonce and the browser then blocks every script on
// the page. Nonce-based CSP therefore forces every route to render dynamically
// (see https://nextjs.org/docs/app/guides/content-security-policy — "you must
// use dynamic rendering to add nonces" and "Partial Prerendering (PPR) is
// incompatible with nonce-based CSP"), which this site cannot afford: it relies
// on `generateStaticParams` and 16 `'use cache'` call sites.
//
// A static policy lives in next.config.ts instead of the proxy, which is the
// documented "Without Nonces" pattern, and lets pages be prerendered and
// CDN-cached again.
//
// Trade-off: `script-src` needs `'unsafe-inline'` (Next.js emits inline
// bootstrap/RSC-payload scripts whose content changes per page and per build,
// so hashes are not maintainable). Because `'strict-dynamic'` is also gone,
// every third-party origin must now be listed explicitly rather than inherited
// transitively from a trusted loader. See AUDIT.md SEC-M3.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} blob: https://www.googletagmanager.com https://www.google-analytics.com https://upload-widget.cloudinary.com https://*.cloudinary.com https://www.instagram.com https://*.cdninstagram.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: www.googletagmanager.com https://*.unsplash.com https://*.cdninstagram.com https://*.cloudinary.com https://*.googleapis.com https://*.gstatic.com https://*.basemaps.cartocdn.com *.google.com *.googleusercontent.com;
  font-src 'self' https://fonts.gstatic.com data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self' *.google.com https://www.instagram.com/ https://upload-widget.cloudinary.com https://www.youtube.com https://www.youtube-nocookie.com/;
  connect-src 'self' *.google-analytics.com *.de.sentry.io ${isProd ? 'https://*.googleapis.com *.google.com https://stats.g.doubleclick.net https://*.gstatic.com data: blob:' : 'http://127.0.0.1:54321'};
  media-src 'self' https://www.youtube.com;
  block-all-mixed-content;
  upgrade-insecure-requests;
`;

const contentSecurityPolicy = cspHeader.replace(/\s{2,}/g, ' ').trim();

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
  cacheMaxMemorySize: 50,
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
    loader: 'custom',
    loaderFile: './payload/components/Media/ImageMedia/cloudinaryLoader.ts',
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
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
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
