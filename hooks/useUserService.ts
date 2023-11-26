import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';

const useUserService = () => {
  const supabaseClient = createSupabaseBrowserClient();

  async function loginWithFacebook() {
    debugger;
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/profile`,
      },
    });

    return { error };
  }

  async function loginWithGoogle() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/profile`,
      },
    });

    return { error };
  }

  async function signout() {
    const { error } = await supabaseClient.auth.signOut();
    return error;
  }

  return {
    loginWithFacebook,
    signout,
    loginWithGoogle,
  };
};

export default useUserService;
