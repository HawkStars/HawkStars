import { Database } from '@/database.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const createSupabaseServerClient = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>(
    {
      cookies: () => cookieStore,
    },
    {
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    }
  );
  return supabase;
};

export default createSupabaseServerClient;
