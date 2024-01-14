import { cookieName, fallbackLng, languages } from '@/i18n/settings';
import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse } from 'next/server';

acceptLanguage.languages(languages);

const withHandleInternalization = async (request: NextRequest): Promise<NextResponse> => {
  const response = NextResponse.next({});
  let lng;
  if (request.cookies.has(cookieName))
    lng = acceptLanguage.get(request.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => request.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !request.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${request.nextUrl.pathname}`, request.url));
  }

  if (request.headers.has('referer')) {
    const refererUrl = new URL(request.headers.get('referer') || '');
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));

    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return response;
};

export default withHandleInternalization;
