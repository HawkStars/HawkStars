import { Database } from '@/database.types';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  return supabase;
};

export default createSupabaseServerClient;
