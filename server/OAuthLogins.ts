'use client';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { OAUTH_CALLBACK_URL } from '@/utils/paths';

const REDIRECT_LOGIN_URL =
  `${process.env.NEXT_PUBLIC_APP_URL}${OAUTH_CALLBACK_URL}` as const;

async function loginWithEmail(email: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: REDIRECT_LOGIN_URL,
    },
  });

  return { data, error };
}

async function loginWithFacebook() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: REDIRECT_LOGIN_URL,
    },
  });
  return { error };
}

async function loginWithGoogle() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: REDIRECT_LOGIN_URL,
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

export { loginWithFacebook, signOut, loginWithGoogle, loginWithEmail };
