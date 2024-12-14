'use client';

import MainHawkStarsLoading from '@/app/[lng]/loading';
import { HawkStarsSection } from '../layout';
import dynamic from 'next/dynamic';

const ContributionProjectGoal = dynamic(
  () => import('@/components/transparency/ContributionProjectGoal'),
  { ssr: false, loading: () => <MainHawkStarsLoading /> }
);

// const OrganizationContributionsTable = dynamic(
//   () => import('@/components/transparency/OrganizationContributionsTable'),
//   { ssr: false, loading: () => <MainHawkStarsLoading /> }
// );

const OrganizationMovementsTable = dynamic(
  () => import('@/components/transparency/OrganizationMovementsTable'),
  { ssr: false, loading: () => <MainHawkStarsLoading /> }
);

export default function TransparencyMain() {
  return (
    <>
      <ContributionProjectGoal />
      <HawkStarsSection>
        <div className='flex flex-col gap-10 lg:gap-16'>
          {/* <OrganizationContributionsTable /> */}
          <OrganizationMovementsTable />
        </div>
      </HawkStarsSection>
    </>
  );
}
