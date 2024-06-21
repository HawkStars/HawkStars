import dynamic from 'next/dynamic';
import MainHawkStarsLoading from '../loading';
import { ResolvingMetadata, Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import { HawkStarsSection } from '@/components/layout';

const ContributionProjectGoal = dynamic(
  () => import('@/components/transparency/ContributionProjectGoal'),
  { ssr: false, loading: () => <MainHawkStarsLoading /> }
);

const OrganizationContributionsTable = dynamic(
  () => import('@/components/transparency/OrganizationContributionsTable'),
  { ssr: false, loading: () => <MainHawkStarsLoading /> }
);

const OrganizationMovementsTable = dynamic(
  () => import('@/components/transparency/OrganizationMovementsTable'),
  { ssr: false, loading: () => <MainHawkStarsLoading /> }
);

export async function generateMetadata(
  { params }: LanguagePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'transparency');
  return metadataPage;
}

const TransparencyPage = async () => {
  return (
    <section className='flex flex-col gap-5 overflow-x-hidden'>
      <div className='flex flex-col gap-10'>
        <ContributionProjectGoal />
        <HawkStarsSection>
          <div className='flex flex-col gap-10 lg:gap-16'>
            <OrganizationContributionsTable />
            <OrganizationMovementsTable />
          </div>
        </HawkStarsSection>
      </div>
    </section>
  );
};

export default TransparencyPage;
