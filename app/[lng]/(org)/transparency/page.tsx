import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import { getContributionsQuery, getSumContributions } from '@/lib/payload/queries/contribution';
import ContributionProjectGoal from '@/components/transparency/ContributionProjectGoal';
import OrganizationContributionsTable from '@/components/transparency/OrganizationContributionsTable';
import { Suspense } from 'react';

export const instant = false;

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'transparency');
  return metadataPage;
}

// Both queries are already cached, but the route still had no boundary above the
// `params` await, so it stayed blocking. The two queries are also independent —
// they were awaited in series for no reason.
const TransparencyPage = (props: LanguagePageProps) => (
  <Suspense fallback={<></>}>
    <TransparencyContent params={props.params} />
  </Suspense>
);

const TransparencyContent = async ({ params }: { params: LanguagePageProps['params'] }) => {
  const [{ lng }, sumContributions, organizationContributions] = await Promise.all([
    params,
    getSumContributions(),
    getContributionsQuery(),
  ]);

  if (sumContributions === null) return null;

  return (
    <section className='flex flex-col gap-5 overflow-x-hidden'>
      <ContributionProjectGoal sumContributions={sumContributions} />
      <OrganizationContributionsTable data={organizationContributions} lng={lng} />
    </section>
  );
};

export default TransparencyPage;
