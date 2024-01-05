import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { Contributions } from '@/models/database';
import { v4 as uuidv4 } from 'uuid';
import { ContributionFormInput } from './FormContributions';

const addOrganizationContribution = async ({
  value,
  donor,
  description,
  type,
  contribution_date,
}: ContributionFormInput) => {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase
    .from<'contributions', Contributions>('contributions')
    .insert({
      id: uuidv4(),
      value,
      description,
      donor,
      type,
      contribution_date: contribution_date.toISOString(),
    });

  if (error) return false;
  return true;
};

export { addOrganizationContribution };
