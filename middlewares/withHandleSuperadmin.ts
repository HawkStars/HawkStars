import { fallbackLng } from '@/i18n/settings';
import createSupabaseMiddlewareClient from '@/lib/supabase/middleware/supabaseMiddlewareClient';
import { Profile } from '@/models/database';

import { NextRequest, NextResponse } from 'next/server';

const withHandleSuperadmin = async (request: NextRequest): Promise<NextResponse> => {
  const { success, response } = await checkIfAuthenticated(request);
  if (!success) return NextResponse.redirect(new URL(`${fallbackLng}/`, request.url));

  return response;
};

async function checkIfAuthenticated(
  req: NextRequest
): Promise<{ success: boolean; response: NextResponse }> {
  const res = NextResponse.next({ request: { headers: req.headers } });
  const { supabase, response } = createSupabaseMiddlewareClient(req, res);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return { success: false, response };

  const userId = user.id;
  const { data, error: userError } = await supabase
    .from<'profiles', Profile>('profiles')
    .select()
    .match({ type: 'ADMIN', id: userId })
    .single();

  if (userError || !data) return { success: false, response };
  return { success: true, response };
}

export default withHandleSuperadmin;
