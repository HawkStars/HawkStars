import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';

const useUserService = () => {
  const supabaseClient = createSupabaseBrowserClient();

  async function loginWithFacebook() {
    debugger;
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });

    return { error };
  }

  async function loginWithGoogle() {
    console.log(window.location.origin);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
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
