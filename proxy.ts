import { NextRequest } from 'next/server';
import withHandleInternalization from './utils/middlewares/withHandleInternalization';
import createCSPNonce from './utils/middlewares/createCSPNonce';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap
     * - llms
     * - llms-full
     */
    {
      source: '/((?!api|sitemap|robots|llms|llms-full|_next/static|_next/image|images|favicon).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.includes('admin')) {
    const response = createCSPNonce(request);
    response.headers.set('x-pathname', request.nextUrl.pathname);
    return response;
  }

  return withHandleInternalization(request);
}
