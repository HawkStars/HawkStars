import OrganizationContributionsTable from '@/components/transparency/OrganizationContributionsTable';
import OrganizationMovementsTable from '@/components/transparency/OrganizationMovementsTable';
import LineBreaker from '@/components/utils/LineBreaker/LineBreaker';
import Spinner from '@/components/utils/Spinner/Spinner';
import dynamic from 'next/dynamic';

const ContributionProjectGoal = dynamic(
  () => import('@/components/transparency/ContributionProjectGoal'),
  { ssr: false, loading: () => <Spinner /> }
);

const TransparencyPage = async () => {
  return (
    <section className='layout-section flex flex-col gap-5'>
      <div className='flex flex-col gap-10'>
        <ContributionProjectGoal />
        <OrganizationContributionsTable />
        <LineBreaker />
        <OrganizationMovementsTable />
      </div>
    </section>
  );
};

export default TransparencyPage;
