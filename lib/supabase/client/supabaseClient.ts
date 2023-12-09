import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const createSupabaseBrowserClient = () => {
  const supabase = createClientComponentClient();
  return supabase;
};

export default createSupabaseBrowserClient;
