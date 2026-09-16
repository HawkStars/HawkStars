import { NextRequest, NextResponse } from 'next/server';
import withHandleInternalization from './utils/middlewares/withHandleInternalization';

export const config = {
  matcher: ['/((?!api|sitemap|robots|llms|llms-full|_next/static|_next/image|images|favicon).*)'],
};

export async function proxy(request: NextRequest) {
  // Segment match, not substring: `.includes('admin')` also matched any slug
  // containing the word — "administração" slugifies to "administracao" — and
  // those pages silently lost locale detection and redirection.
  if (request.nextUrl.pathname.split('/').includes('admin')) {
    const response = NextResponse.next();
    response.headers.set('x-pathname', request.nextUrl.pathname);
    return response;
  }

  return withHandleInternalization(request);
}
