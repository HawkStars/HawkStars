import { LanguageProps } from '@/components/types';
import { Language } from '@/i18n/settings';
import { getNewsQuery, getProjectsForNewsFilter } from '@/lib/payload/queries/news';
import { getNewsListHeader } from '@/lib/payload/queries/globals/newsList';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import NewsListComponent from '@/components/news/list/NewsListComponent';
import NewsListHeader from '@/components/news/list/NewsListHeader';
import NewsProjectFilter from '@/components/news/list/NewsProjectFilter';

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
  const projectSlug = typeof searchParams.project === 'string' ? searchParams.project : undefined;

  const [newsListHeader, news, projects] = await Promise.all([
    getNewsListHeader(lng as Language),
    getNewsQuery(page, lng as Language, projectSlug),
    getProjectsForNewsFilter(lng as Language),
  ]);

  return (
    <>
      <NewsListHeader title={newsListHeader?.title || 'News'} subtitle={newsListHeader?.subtitle} />
      <div className='container mx-auto max-w-6xl px-4 pt-6'>
        <NewsProjectFilter
          projects={projects}
          lng={lng}
          currentProjectSlug={projectSlug}
        />
      </div>
      <NewsListComponent news={news} lng={lng} projectSlug={projectSlug} />
    </>
  );
};

export default NewsIndexPage;
