const cspHeader = `
    default-src 'self';
    script-src 'self' https://www.googletagmanager.com 'unsafe-eval' 'unsafe-inline';
    style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
    img-src 'self' blob: data: www.googletagmanager.com https://*.googleapis.com https://*.gstatic.com *.google.com *.googleusercontent.com data:;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    frame-src *.google.com https://upload-widget.cloudinary.com;
    connect-src 'self' *.api.sanity.io ${process.env.NODE_ENV == 'production' ? `https://*.googleapis.com *.google.com https://*.gstatic.com ${process.env.NEXT_PUBLIC_SUPABASE_URL} data: blob:` : 'http://127.0.0.1:54321'};
    worker-src blob:;
    script-src-elem 'self' https://www.googletagmanager.com https://upload-widget.cloudinary.com 'unsafe-inline';
`;

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
    ],
  },
  experimental: {
    taint: true,
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
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

// https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
