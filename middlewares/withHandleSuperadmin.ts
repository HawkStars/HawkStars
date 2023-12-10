import { fallbackLng } from '@/i18n/settings';
import { Profile } from '@/models/database';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

const withHandleSuperadmin = async (
  request: NextRequest
): Promise<NextResponse> => {
  const isSuperAdmin = await checkIfAuthenticated(request);
  if (!isSuperAdmin)
    return NextResponse.redirect(new URL(`${fallbackLng}/`, request.url));

  return NextResponse.next();
};

async function checkIfAuthenticated(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return false;

  const userId = user.id;
  const { data, error: userError } = await supabase
    .from<'profiles', Profile>('profiles')
    .select()
    .match({ type: 'ADMIN', id: userId })
    .single();

  if (!data) return false;

  return true;
}

export default withHandleSuperadmin;
