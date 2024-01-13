import { NextRequest, NextResponse } from 'next/server';
import withHandleSuperadmin from './middlewares/withHandleSuperadmin';
import withHandleInternalization from './middlewares/withHandleInternalization';
import { addContentSecurityPolicy } from './middlewares/addContentSecurityPolicy';

export const config = {
  // matcher: '/:lng*',
  matcher: ['/((?!api|sitemap|robots|_next/static|_next/image|images|favicon).*)'],
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes('auth')) return addContentSecurityPolicy(request);
  if (request.nextUrl.pathname.includes('superadmin')) return withHandleSuperadmin(request);

  return withHandleInternalization(request);
}
