const cspHeader = `
    default-src 'self';
    script-src 'self' https://www.googletagmanager.com  'unsafe-eval' 'unsafe-inline';
    style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
    img-src 'self' blob: data: www.googletagmanager.com https://*.googleapis.com https://*.gstatic.com *.google.com *.googleusercontent.com data:;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    frame-src *.google.com;
    connect-src 'self' https://*.googleapis.com *.google.com https://*.gstatic.com https://deprwkxsmgjfeeberzzw.supabase.co data: blob:;
    worker-src blob:;
`;

const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
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
