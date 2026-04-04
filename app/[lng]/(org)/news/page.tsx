import { LanguageProps } from '@/components/types';
import { Language } from '@/i18n/settings';
import { getNewsQuery } from '@/lib/payload/queries/news';
import { getNewsListHeader } from '@/lib/payload/queries/globals/newsList';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import NewsListComponent from '@/components/news/list/NewsListComponent';
import NewsListHeader from '@/components/news/list/NewsListHeader';

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

const NewsIndexPage = async (props: NewsPageProps) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { lng } = params;
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const [newsListHeader, news] = await Promise.all([
    getNewsListHeader(lng as Language),
    getNewsQuery(page, lng as Language),
  ]);

  return (
    <>
      <NewsListHeader title={newsListHeader?.title || 'News'} subtitle={newsListHeader?.subtitle} />
      <NewsListComponent news={news} lng={lng} />
    </>
  );
};

export default NewsIndexPage;
