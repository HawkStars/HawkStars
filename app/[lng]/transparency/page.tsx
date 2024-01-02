import OrganizationContributionsTable from '@/components/transparency/OrganizationContributionsTable';
import OrganizationMovementsTable from '@/components/transparency/OrganizationMovementsTable';
import LineBreaker from '@/components/utils/LineBreaker/LineBreaker';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import MainHawkStarsLoading from '../loading';

const ContributionProjectGoal = dynamic(
  () => import('@/components/transparency/ContributionProjectGoal'),
  { ssr: false, loading: () => <MainHawkStarsLoading /> }
);

const TransparencyPage = async () => {
  return (
    <section className='layout-section mt-4 flex flex-col gap-5 overflow-x-hidden lg:mt-10'>
      <div className='flex flex-col gap-10'>
        <ContributionProjectGoal />
        <Suspense fallback={<p>loading...</p>}>
          <OrganizationContributionsTable />
        </Suspense>
        <LineBreaker />
        <Suspense fallback={<p>loading...</p>}>
          <OrganizationMovementsTable />
        </Suspense>
      </div>
    </section>
  );
};

export default TransparencyPage;
