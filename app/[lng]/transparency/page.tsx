import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import { getContributionsQuery, getSumContributions } from '@/lib/payload/queries/contribution';
import ContributionProjectGoal from '@/components/transparency/ContributionProjectGoal';
import OrganizationContributionsTable from '@/components/transparency/OrganizationContributionsTable';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'transparency');
  return metadataPage;
}

const TransparencyPage = async ({ params }: LanguagePageProps) => {
  const sumContributions = await getSumContributions();
  if (sumContributions === null) return null;

  const data = await params;
  const { lng } = data;

  const organizationContributions = await getContributionsQuery();

  return (
    <section className='flex flex-col gap-5 overflow-x-hidden'>
      <ContributionProjectGoal sumContributions={sumContributions} />
      <OrganizationContributionsTable data={organizationContributions} lng={lng} />
    </section>
  );
};

export default TransparencyPage;
