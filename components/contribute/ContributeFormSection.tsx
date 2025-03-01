'use client';

import { LanguageProps } from '../types';
import FormContributions, { ContributionFormInput } from './FormContributions/FormContributions';

const ContributeFormSection = ({ lng }: LanguageProps) => {
  const handleSubmitForm = async (data: ContributionFormInput) => {
    try {
      const newDoc = {
        _type: 'contribution',
        ...data,
      };

      const response = await fetch('/api/contribution', {
        method: 'POST',
        body: JSON.stringify(newDoc),
      });
      const apiData = await response.json();
    } catch (e) {}
  };

  return (
    <div className='mx-auto mt-10 lg:w-1/2'>
      <FormContributions formType={'create'} lng={lng} onSubmit={handleSubmitForm} />
    </div>
  );
};

export default ContributeFormSection;
