'use client';

import { useState } from 'react';
import FormContributions, { ContributionFormInput } from '../FormContributions/FormContributions';
import { addOrganizationContribution } from '../FormContributions/service';
import { toast } from 'react-toastify';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';

const FormContributionSection = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const supabase = createSupabaseBrowserClient();

  const handleSubmitForm = async (data: ContributionFormInput) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return toast.error('User missing to confirm confirm contributions');

    setLoading(true);
    addOrganizationContribution({ ...data, confirmed_by: user.id })
      .then(() => toast.success('Added Contribution'))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <section className='flex flex-col gap-3 rounded-xl bg-bege-light py-10'>
      <h3 className='text-center'>Contributions</h3>
      <div className='mx-auto w-11/12 lg:w-1/2'>
        <FormContributions formType='create' onSubmit={handleSubmitForm} loading={loading} />
      </div>
    </section>
  );
};

export default FormContributionSection;
