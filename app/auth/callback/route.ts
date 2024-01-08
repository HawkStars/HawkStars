import createSupabaseRouteHandlerClient from '@/lib/supabase/route/supabaseRouteClient';
import { Profiles } from '@/models/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createSupabaseRouteHandlerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      const { error } = await supabase
        .from<'profiles', Profiles>('profiles')
        .upsert(
          {
            id: user.id,
            name: user?.user_metadata?.name || '',
            type: 'REGULAR',
          },
          { onConflict: 'id', ignoreDuplicates: true }
        );

      if (error) console.log(error);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
