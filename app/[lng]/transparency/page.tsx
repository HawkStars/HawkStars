import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import dynamic from 'next/dynamic';
import MainHawkStarsLoading from '../loading';
import ContributionProjectGoal from '@/components/transparency/ContributionProjectGoal';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'transparency');
  return metadataPage;
}

const OrganizationContributionsTable = dynamic(
  () => import('@/components/transparency/OrganizationContributionsTable'),
  { loading: () => <MainHawkStarsLoading /> }
);

const TransparencyPage = async () => {
  return (
    <section className='flex flex-col gap-5 overflow-x-hidden'>
      <ContributionProjectGoal />
      <OrganizationContributionsTable />
    </section>
  );
};

export default TransparencyPage;
