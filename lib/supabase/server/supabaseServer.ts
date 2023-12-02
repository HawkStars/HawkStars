import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const createSupabaseServerClient = (
  cookiesInfo: ReturnType<typeof cookies>
) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {
      auth: { storageKey: 'hawkstars-token' },
      cookies: {
        get(name: string) {
          return cookiesInfo.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookiesInfo.set({
              name,
              value,
              ...options,
            });
          } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookiesInfo.set({
              name,
              value: '',
              ...options,
            });
          } catch (error) {}
        },
      },
    }
  );
};

export default createSupabaseServerClient;
