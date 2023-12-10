import FormContributions from '@/components/superadmin/FormContributions/FormContributions';
import FormOrganizationMovement from '@/components/superadmin/FormOrganizationMovements/FormOrganizationMovements';

const SuperAdminPage = () => {
  const addOrganizationMovement = () => {};

  const addContribution = () => {};
  return (
    <section className='mt-10'>
      <section>
        <h3 className='text-center'>Movimentos Organização</h3>
        <FormOrganizationMovement type={'create'} />
      </section>
      <section className='flex flex-col gap-3'>
        <h3>Contributions</h3>
        <FormContributions />
      </section>
    </section>
  );
};

export default SuperAdminPage;
