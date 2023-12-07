import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const createSupabaseServerClient = (
  cookiesInfo: ReturnType<typeof cookies>
) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {
      cookies: {
        get(name: string) {
          return cookiesInfo.get(name)?.value;
        },
      },
    }
  );
};

export default createSupabaseServerClient;
