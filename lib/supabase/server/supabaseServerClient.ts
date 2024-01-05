import { Database } from '@/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>(
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
