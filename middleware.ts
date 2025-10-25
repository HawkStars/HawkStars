import { NextRequest, NextResponse } from 'next/server';
import withHandleInternalization from './utils/middlewares/withHandleInternalization';

export const config = {
  matcher: ['/((?!api|sitemap|robots|_next/static|_next/image|images|favicon).*)'],
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes('admin')) return NextResponse.next();

  return withHandleInternalization(request);
}
