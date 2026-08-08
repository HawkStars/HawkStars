import { fallbackLng, i18CookieName, languages } from '@/i18n/settings';
import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse } from 'next/server';

// Without this, `accept-language` matches against its own large internal
// list of language tags rather than the two the app actually supports, so
// `.get()` can return values like 'fr' or 'zh-Hans' for ordinary browser
// or bot Accept-Language headers. Those then get used as the `/${lng}`
// redirect prefix below, producing a route segment outside ['pt', 'en']
// that downstream pages/components (Payload's `locale` param,
// `toLocaleDateString(lng)`, etc.) were never built to handle.
acceptLanguage.languages([...languages]);

/**
 * True only when the pathname's FIRST SEGMENT is exactly a supported locale.
 *
 * This must be a whole-segment match, not `startsWith('/' + loc)`. The loose
 * form treats `/ptx/foo` and `/entertainment` as already-localized (both
 * start with `/pt` / `/en`), and this file previously used the loose form in
 * `getLocale` while using the strict form in `withHandleInternalization`.
 * That mismatch was the actual hole: a path like `/ptx/foo` failed the strict
 * check (so it fell through to `getLocale`), then passed the loose check (so
 * it was NOT redirected) — and rendered with `lng = 'ptx'`. Every downstream
 * consumer of `lng` (Payload's `locale` param, `toLocaleDateString(lng)`)
 * then received a value outside ['pt', 'en'].
 */
const hasSupportedLocalePrefix = (pathname: string): boolean =>
  languages.some((loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`));

// Get the preferred locale, similar to the above or using a library.
// Receives the response built by withHandleInternalization so cookies and
// headers are set on a single response object.
const getLocale = async (request: NextRequest, response: NextResponse): Promise<NextResponse> => {
  // Note: this function only ever runs when `hasSupportedLocalePrefix` was
  // already false for this pathname (see the caller below), so deriving `lng`
  // from the pathname itself is never useful here — go straight to the
  // cookie / Accept-Language / fallback chain.
  let lng: string | null = null;
  if (request.cookies.has(i18CookieName))
    lng = acceptLanguage.get(request.cookies.get(i18CookieName)?.value);
  if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  // Redirect if lng in path is not supported.
  //
  // This is now the ONLY gate keeping unsupported `[lng]` values out of the
  // app: `export const dynamicParams = false` cannot be used in the [lng]
  // layouts because it is incompatible with `cacheComponents` (enabled in
  // next.config.ts). Anything that isn't exactly /pt or /en gets rewritten
  // under a supported locale here, so e.g. /fr/news becomes /pt/fr/news and
  // resolves to the catch-all 404 rather than rendering with lng='fr'.
  if (
    !hasSupportedLocalePrefix(request.nextUrl.pathname) &&
    !request.nextUrl.pathname.startsWith('/_next')
  ) {
    // Avoid producing a trailing slash for the root path (`/`), which would
    // otherwise redirect to `/pt/` and trigger a second (308) redirect to `/pt`.
    const targetPath = request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname;
    return NextResponse.redirect(new URL(`/${lng}${targetPath}`, request.url), 301);
  }
  // Reachable only for `/_next/*` paths that slip past the config matcher —
  // every other pathname that gets this far was redirected above. (This was
  // already near-dead before the strict-match fix; the loose `startsWith`
  // check was the only thing that let normal page requests reach it, and
  // those were exactly the bogus-locale renders being fixed here.)
  if (request.headers.has('referer')) {
    const refererUrl = new URL(request.headers.get('referer') || '');
    // Whole-segment match here too, so an `/entertainment` referer can't be
    // read as the 'en' locale.
    const lngInReferer = languages.find(
      (l) => refererUrl.pathname === `/${l}` || refererUrl.pathname.startsWith(`/${l}/`)
    );
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

  if (hasSupportedLocalePrefix(pathname)) return response;
  // Redirect if there is no locale
  return getLocale(request, response);
};

export default withHandleInternalization;
