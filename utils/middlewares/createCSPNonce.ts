import { NextRequest, NextResponse } from 'next/server';

const createCSPNonce = (request: NextRequest) => {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';
  const cspHeader = `
    default-src 'self';
    script-src 'self' blob: https://www.googletagmanager.com https://upload-widget.cloudinary.com https://www.instagram.com/embed.js 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' https://fonts.googleapis.com 'nonce-${nonce}';
    img-src 'self' blob: data: www.googletagmanager.com https://*.unsplash.com https://*.cdninstagram.com https://*.cloudinary.com https://*.googleapis.com https://*.gstatic.com https://*.basemaps.cartocdn.com *.google.com *.googleusercontent.com;
    font-src 'self' https://fonts.gstatic.com data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    frame-src 'self' *.google.com https://www.instagram.com/ https://upload-widget.cloudinary.com https://www.youtube.com https://www.youtube-nocookie.com/;
    connect-src 'self' *.google-analytics.com *.de.sentry.io ${process.env.NODE_ENV == 'production' ? `https://*.googleapis.com *.google.com https://stats.g.doubleclick.net https://*.gstatic.com data: blob:` : 'http://127.0.0.1:54321'};
    media-src 'self' https://www.youtube.com;
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  return response;
};

export default createCSPNonce;
