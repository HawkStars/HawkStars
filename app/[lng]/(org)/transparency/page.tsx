import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import {
  getContributionsQuery,
  getContributionTotalsByType,
} from '@/lib/payload/queries/contribution';
import ContributionProjectGoal from '@/components/transparency/ContributionProjectGoal';
import OrganizationContributionsTable from '@/components/transparency/OrganizationContributionsTable';
import { Suspense } from 'react';
import { PageLoading } from '@/components/layout';

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
  <Suspense fallback={<PageLoading />}>
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
  const [{ lng }, totals, organizationContributions] = await Promise.all([
    params,
    getContributionTotalsByType(),
    getContributionsQuery(requestedPage),
  ]);

  return (
    <>
      <ContributionProjectGoal totals={totals} />
      <OrganizationContributionsTable data={organizationContributions} lng={lng} />
    </>
  );
};

export default TransparencyPage;
