import { NextRequest } from 'next/server';
import withHandleSuperadmin from './middlewares/withHandleSuperadmin';
import withHandleInternalization from './middlewares/withHandleInternalization';

export const config = {
  // matcher: '/:lng*',
  matcher: [
    '/((?!api|sitemap|robots|_next/static|_next/image|images|favicon).*)',
  ],
};

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.includes('superadmin')) {
    return withHandleSuperadmin(req);
  }

  return withHandleInternalization(req);
}
