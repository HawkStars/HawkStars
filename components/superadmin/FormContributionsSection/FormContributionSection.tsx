'use client';
import { useState } from 'react';
import FormContributions, { ContributionFormInput } from '../FormContributions/FormContributions';
import { addOrganizationContribution } from '../FormContributions/service';

const FormContributionSection = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmitForm = async (data: ContributionFormInput) => {
    setLoading(true);
    await addOrganizationContribution(data);
    setLoading(false);
  };
  return (
    <section className='flex flex-col gap-3 rounded-xl bg-bege-light p-4'>
      <h3 className='text-center'>Contributions</h3>
      <div className='mx-auto w-1/2'>
        <FormContributions formType='create' onSubmit={handleSubmitForm} loading={loading} />
      </div>
    </section>
  );
};

export default FormContributionSection;
