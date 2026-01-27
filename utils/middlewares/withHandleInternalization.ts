import { fallbackLng, i18CookieName, languages } from '@/i18n/settings';
import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse } from 'next/server';

// Get the preferred locale, similar to the above or using a library
const getLocale = async (request: NextRequest): Promise<NextResponse> => {
  const response = NextResponse.next();

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
    return NextResponse.redirect(new URL(`/${lng}${request.nextUrl.pathname}`, request.url), 301);
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
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = languages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return response;
  // Redirect if there is no locale
  return getLocale(request);
};

export default withHandleInternalization;
