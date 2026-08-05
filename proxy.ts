import { NextRequest, NextResponse } from 'next/server';
import withHandleInternalization from './utils/middlewares/withHandleInternalization';
import createCSPNonce from './utils/middlewares/createCSPNonce';

export const config = {
  matcher: ['/((?!api|sitemap|robots|llms|llms-full|_next/static|_next/image|images|favicon).*)'],
};

export async function proxy(request: NextRequest) {
  const response = createCSPNonce(request);
  response.headers.set('x-pathname', request.nextUrl.pathname);
  if (request.nextUrl.pathname.includes('admin')) return response;

  return withHandleInternalization(request);
}
