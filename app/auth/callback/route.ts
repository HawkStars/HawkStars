import { Profiles } from '@/models/database';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && user) {
      const { data, error } = await supabase
        .from<'profiles', Profiles>('profiles')
        .upsert(
          {
            id: user.id,
            name: user.user_metadata.name || '',
            type: 'REGULAR',
          },
          { onConflict: 'id', ignoreDuplicates: true }
        );
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
