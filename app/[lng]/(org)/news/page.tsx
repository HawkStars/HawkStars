import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getNewsQuery } from '@/lib/payload/queries/news';
import { getNewsListHeader } from '@/lib/payload/queries/globals/newsList';
import { News } from '@/payload-types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import NewsListComponent from '@/components/news/list/NewsListComponent';
import NewsListHeader from '@/components/news/list/NewsListHeader';
import { Suspense } from 'react';

// Mirrors components/news/constants.ts's NewsTypeLabels keys -- kept explicit
// (rather than Object.keys(NewsTypeLabels)) so the filter's option order is
// stable and independent of that map's declaration order.
const NEWS_TYPES: News['type'][] = ['blog', 'news', 'press_release', 'announcement', 'other'];

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
  const type =
    typeof resolvedSearchParams.type === 'string'
      ? (resolvedSearchParams.type as News['type'])
      : undefined;

  const pageParam = Number(resolvedSearchParams.page);
  const limitParam = Number(resolvedSearchParams.limit);
  const page = Number.isFinite(pageParam) ? pageParam : 1;
  const limitNews = Number.isFinite(limitParam) ? limitParam : 10;

  const [newsListHeader, news, { t }] = await Promise.all([
    getNewsListHeader(lng as Language),
    getNewsQuery(lng as Language, { page, limit: limitNews, type }),
    // News has no locale file of its own -- the "common" namespace already
    // carries a label.* map for these exact type values (used elsewhere for
    // the same enum), plus filterByType/allTypes added alongside it.
    getServerTranslation(lng, 'common'),
  ]);

  const filters = [
    {
      param: 'type',
      allLabel: t('allTypes'),
      value: type,
      options: NEWS_TYPES.map((value) => ({ value, label: t(`label.${value}`) })),
    },
  ];

  return (
    <>
      <NewsListHeader title={newsListHeader?.title || 'News'} subtitle={newsListHeader?.subtitle} />
      <NewsListComponent news={news} lng={lng} filters={filters} />
    </>
  );
};

export default NewsIndexPage;
