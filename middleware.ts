import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse } from 'next/server';
import { fallbackLng, languages, cookieName } from './i18n/settings';
import createSupabaseServerClient from './lib/supabase/server/supabaseServer';
import { cookies } from 'next/headers';
import { Profile } from './models/database';

acceptLanguage.languages(languages);

export const config = {
  // matcher: '/:lng*',
  matcher: [
    '/((?!api|sitemap|robots|_next/static|_next/image|images|favicon).*)',
  ],
};

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.includes('superadmin')) {
    const isSuperAdmin = await checkIfAuthenticated(req.cookies);
    if (!isSuperAdmin) return NextResponse.redirect('/');
    return NextResponse.next();
  }

  let lng;
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    );
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '');
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}

async function checkIfAuthenticated(cookiesInfo: ReturnType<typeof cookies>) {
  const supabase = createSupabaseServerClient(cookiesInfo);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const userId = user.id;
  const { data } = await supabase
    .from<'profiles', Profile>('profiles')
    .select('type')
    .eq('id', userId)
    .single();

  if (data?.type != 'ADMIN') return false;

  return true;
}
