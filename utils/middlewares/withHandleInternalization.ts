import { fallbackLng, i18CookieName, languages } from '@/i18n/settings';
import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse } from 'next/server';

// Get the preferred locale, similar to the above or using a library.
// Receives the response built by withHandleInternalization so cookies and
// headers are set on a single response object.
const getLocale = async (
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> => {
  let lng = request.nextUrl.pathname.split('/')[0] || null;
  if (!lng && request.cookies.has(i18CookieName))
    lng = acceptLanguage.get(request.cookies.get(i18CookieName)?.value);
  if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => request.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !request.nextUrl.pathname.startsWith('/_next')
  ) {
    // Avoid producing a trailing slash for the root path (`/`), which would
    // otherwise redirect to `/pt/` and trigger a second (308) redirect to `/pt`.
    const targetPath = request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname;
    return NextResponse.redirect(new URL(`/${lng}${targetPath}`, request.url), 301);
  }
  if (request.headers.has('referer')) {
    const refererUrl = new URL(request.headers.get('referer') || '');
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    if (lngInReferer) response.cookies.set(i18CookieName, lngInReferer);
    return response;
  }
  response.cookies.set(i18CookieName, lng);
  return response;
};

const withHandleInternalization = async (request: NextRequest): Promise<NextResponse> => {
  const response = NextResponse.next();
  response.headers.set('x-pathname', request.nextUrl.pathname);
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = languages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return response;
  // Redirect if there is no locale
  return getLocale(request, response);
};

export default withHandleInternalization;
