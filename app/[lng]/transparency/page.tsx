import ContributionProjectGoal from '@/components/transparency/ContributionProjectGoal';
import OrganizationContributionsTable from '@/components/transparency/OrganizationContributionsTable';
import OrganizationMovementsTable from '@/components/transparency/OrganizationMovementsTable';
import LineBreaker from '@/components/utils/LineBreaker/LineBreaker';
import { Suspense } from 'react';

const TransparencyPage = async () => {
  return (
    <section className='mx-10 mt-10 flex flex-col gap-5 lg:mx-14'>
      <div className='flex flex-col gap-10'>
        <Suspense fallback={<></>}>
          <ContributionProjectGoal />
        </Suspense>
        <OrganizationContributionsTable />
        <LineBreaker />
        <OrganizationMovementsTable />
      </div>
    </section>
  );
};

export default TransparencyPage;
