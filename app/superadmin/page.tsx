import FormContributions from '@/components/superadmin/FormContributions/FormContributions';
import FormOrganizationMovement from '@/components/superadmin/FormOrganizationMovements/FormOrganizationMovements';

const SuperAdminPage = () => {
  const addOrganizationMovement = () => {};

  const addContribution = () => {};
  return (
    <section className='mt-10 flex flex-col gap-10'>
      <section>
        <h3 className='text-center'>Movimentos Organização</h3>
        <FormOrganizationMovement formType={'create'} />
      </section>
      <section className='flex flex-col gap-3'>
        <h3 className='text-center'>Contributions</h3>
        <FormContributions />
      </section>
    </section>
  );
};

export default SuperAdminPage;
