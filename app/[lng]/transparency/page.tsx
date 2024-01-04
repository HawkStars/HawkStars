import OrganizationContributionsTable from '@/components/transparency/OrganizationContributionsTable';
import OrganizationMovementsTable from '@/components/transparency/OrganizationMovementsTable';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import MainHawkStarsLoading from '../loading';
import { ResolvingMetadata, Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';

const ContributionProjectGoal = dynamic(
  () => import('@/components/transparency/ContributionProjectGoal'),
  { ssr: false, loading: () => <MainHawkStarsLoading /> }
);

export async function generateMetadata(
  { params }: LanguagePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng, 'transparency');
  return metadataPage;
}

const TransparencyPage = async () => {
  return (
    <section className='layout-section mt-4 flex flex-col gap-5 overflow-x-hidden lg:mt-10'>
      <div className='flex flex-col gap-10'>
        <ContributionProjectGoal />
        <Suspense fallback={<p>loading...</p>}>
          <OrganizationContributionsTable />
        </Suspense>
        <Suspense fallback={<p>loading...</p>}>
          <OrganizationMovementsTable />
        </Suspense>
      </div>
    </section>
  );
};

export default TransparencyPage;
