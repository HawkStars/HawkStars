'use client';

import FormContributions, {
  ContributionFormInput,
} from '../superadmin/FormContributions/FormContributions';
import { LanguageProps } from '../types';
import { addOrganizationContribution } from '../superadmin/FormContributions/service';

const ContributeFormSection = ({ lng }: LanguageProps) => {
  const handleSubmitForm = async (data: ContributionFormInput) => {
    return await addOrganizationContribution(data);
  };

  return (
    <div className='mx-auto mt-10 lg:w-1/2'>
      <FormContributions formType={'create'} lng={lng} onSubmit={handleSubmitForm} />
    </div>
  );
};

export default ContributeFormSection;
