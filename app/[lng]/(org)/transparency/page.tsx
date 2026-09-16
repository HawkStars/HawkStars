import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import { getContributionsQuery, getSumContributions } from '@/lib/payload/queries/contribution';
import ContributionProjectGoal from '@/components/transparency/ContributionProjectGoal';
import OrganizationContributionsTable from '@/components/transparency/OrganizationContributionsTable';
import { Suspense } from 'react';

type TransparencyPageProps = LanguagePageProps & {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: TransparencyPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const pageNumber = Number((await props.searchParams)?.page) || undefined;
  return getMetadataPageInfo(lng as Language, 'transparency', pageNumber);
}

// Both queries are already cached, but the route still had no boundary above the
// `params` await, so it stayed blocking. The two queries are also independent —
// they were awaited in series for no reason.
const TransparencyPage = (props: TransparencyPageProps) => (
  <Suspense fallback={<></>}>
    <TransparencyContent params={props.params} searchParams={props.searchParams} />
  </Suspense>
);

const TransparencyContent = async ({
  params,
  searchParams,
}: {
  params: TransparencyPageProps['params'];
  searchParams: TransparencyPageProps['searchParams'];
}) => {
  const requestedPage = Math.max(1, Number((await searchParams)?.page) || 1);
  const [{ lng }, sumContributions, organizationContributions] = await Promise.all([
    params,
    getSumContributions(),
    getContributionsQuery(requestedPage),
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
