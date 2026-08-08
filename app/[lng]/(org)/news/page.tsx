import { LanguageProps } from '@/components/types';
import { Language } from '@/i18n/settings';
import { getNewsQuery } from '@/lib/payload/queries/news';
import { getNewsListHeader } from '@/lib/payload/queries/globals/newsList';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import NewsListComponent from '@/components/news/list/NewsListComponent';
import NewsListHeader from '@/components/news/list/NewsListHeader';
import { Suspense } from 'react';

type NewsPageProps = {
  params: Promise<LanguageProps>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export async function generateMetadata(props: NewsPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  return getMetadataPageInfo(lng as Language, 'news');
}

// This route had no <Suspense> at all while awaiting `searchParams`, which is
// unconditionally dynamic — pagination and the `?project=` filter are per-request
// by definition, so nothing here can be known at build time. Without a boundary
// above that await the whole route is blocking; with one, the shell prerenders
// and only the list streams in per request.
const NewsIndexPage = (props: NewsPageProps) => (
  <Suspense fallback={<></>}>
    <NewsListContent params={props.params} searchParams={props.searchParams} />
  </Suspense>
);

const NewsListContent = async ({
  params,
  searchParams,
}: {
  params: NewsPageProps['params'];
  searchParams: NewsPageProps['searchParams'];
}) => {
  const [{ lng }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
  const projectSlug =
    typeof resolvedSearchParams.project === 'string' ? resolvedSearchParams.project : undefined;

  const [newsListHeader, news] = await Promise.all([
    getNewsListHeader(lng as Language),
    getNewsQuery(page, lng as Language, projectSlug),
  ]);

  return (
    <>
      <NewsListHeader title={newsListHeader?.title || 'News'} subtitle={newsListHeader?.subtitle} />
      <NewsListComponent news={news} lng={lng} projectSlug={projectSlug} />
    </>
  );
};

export default NewsIndexPage;
