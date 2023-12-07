'use client';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { OAUTH_CALLBACK_URL } from '@/utils/paths';

async function loginWithFacebook() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${OAUTH_CALLBACK_URL}`,
    },
  });
  return { error };
}

async function loginWithGoogle() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${OAUTH_CALLBACK_URL}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { error };
}

async function signOut() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  return error;
}

export { loginWithFacebook, signOut, loginWithGoogle };
