import { fallbackLng } from '@/i18n/settings';
import createSupabaseMiddleware from '@/lib/supabase/middleware/supabaseMiddleware';
import { Profile } from '@/models/database';
import { NextRequest, NextResponse } from 'next/server';

const withHandleSuperadmin = async (
  request: NextRequest
): Promise<NextResponse> => {
  const isSuperAdmin = await checkIfAuthenticated(request);
  if (!isSuperAdmin)
    return NextResponse.redirect(new URL(`${fallbackLng}/`, request.url));

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
};

async function checkIfAuthenticated(request: NextRequest) {
  const supabase = createSupabaseMiddleware(request);
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

export default withHandleSuperadmin;
