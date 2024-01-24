import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { GetTotalContributions } from '@/models/database';

const getTotalMoneyGathered = async () => {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.rpc<
    'project_total_contributions',
    GetTotalContributions
  >('project_total_contributions');

  if (error) return 0;
  return data;
};

export { getTotalMoneyGathered };
