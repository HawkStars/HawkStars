import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { Contributions } from '@/models/database';
import { v4 as uuidv4 } from 'uuid';
import { ContributionFormInput } from './FormContributions';

interface SuccessResponse {
  success: true;
  data?: {
    message: string;
  };
}

interface ErrorResponse {
  success: false;
  error: {
    message: string;
  };
}

type DatabaseResponse = SuccessResponse | ErrorResponse;

const addOrganizationContribution = async ({
  value,
  donor,
  extra_info,
  type,
  contribution_date,
}: ContributionFormInput) => {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.from<'contributions', Contributions>('contributions').insert({
    id: uuidv4(),
    value,
    extra_info,
    donor,
    type,
    contribution_date: contribution_date.toISOString(),
  });

  if (error) return false;
  return true;
};

const updateContribution = async (
  contributionId: string,
  data: ContributionFormInput
): Promise<DatabaseResponse> => {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return {
      success: false,
      error: { message: 'Please send a contribution ID to update accordinly' },
    };

  const { error } = await supabase
    .from<'contributions', Contributions>('contributions')
    .update({
      ...data,
      contribution_date: data.contribution_date.toISOString(),
      confirmed_by: user.id,
    })
    .eq('id', contributionId);

  if (error) return { success: false, error: { message: error.message } };
  return { success: true };
};

export { addOrganizationContribution, updateContribution };
