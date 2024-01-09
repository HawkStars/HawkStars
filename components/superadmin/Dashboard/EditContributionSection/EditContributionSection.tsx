import Button from '@/components/utils/Button';
import { Contribution } from '@/models/database';
import FormContributions, {
  ContributionFormInput,
} from '../../FormContributions/FormContributions';
import { toast } from 'react-toastify';
import { updateContribution } from '../../FormContributions/service';

type EditContributionSectionProps = {
  contributionToEdit: Contribution;
  clearContribution: () => void;
};

const EditContributionSection = ({
  contributionToEdit,
  clearContribution,
}: EditContributionSectionProps) => {
  const updatingContribution = async (data: ContributionFormInput) => {
    if (!contributionToEdit)
      return {
        success: false,
        error: { message: 'Please send a contribution ID to update accordinly' },
      };

    const response = await updateContribution(contributionToEdit.id, data);
    if (!response.success) return toast.error(response.error.message);
    toast.success('Updated');
  };

  return (
    <section className='bg-bege-dark p-4'>
      <div className='flex justify-end'>
        <Button type='submit' outline={true} onClick={clearContribution}>
          Close
        </Button>
      </div>
      <FormContributions
        formType={'update'}
        contribution={contributionToEdit}
        onSubmit={updatingContribution}
      />
    </section>
  );
};

export default EditContributionSection;
