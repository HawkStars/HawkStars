import { NextRequest, NextResponse } from 'next/server';
import withHandleSuperadmin from './middlewares/withHandleSuperadmin';
import withHandleInternalization from './middlewares/withHandleInternalization';

export const config = {
  // matcher: '/:lng*',
  matcher: ['/((?!api|sitemap|robots|_next/static|_next/image|images|favicon).*)'],
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes('auth')) return NextResponse.next();
  if (request.nextUrl.pathname.includes('superadmin')) return withHandleSuperadmin(request);

  return withHandleInternalization(request);
}
