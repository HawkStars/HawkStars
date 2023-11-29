import FormContributions from '@/components/superadmin/FormContributions/FormContributions';
import FormOrganizationMovement from '@/components/superadmin/FormOrganizationMovements/FormOrganizationMovements';

const SuperAdminPage = () => {
  return (
    <section>
      <FormOrganizationMovement type={'create'} />
      <FormContributions />
    </section>
  );
};

export default SuperAdminPage;
