import { HawkStarsSection } from '@/components/layout';
import NewsList from '@/components/blog/NewsList';
import { LanguageProps } from '@/components/types';
import { Language } from '@/i18n/settings';
import { getNewsQuery } from '@/lib/payload/queries/news';
import { getNewsListHeader } from '@/lib/payload/queries/globals/newsList';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';

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
      <HawkStarsSection className='bg-bege-light py-10 lg:py-14'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-h1_semibold'>{newsListHeader.title}</h1>
          {newsListHeader.subtitle && (
            <p className='lg:text-h2_light text-body_regular'>{newsListHeader.subtitle}</p>
          )}
        </div>
      </HawkStarsSection>
      <HawkStarsSection className='py-10 lg:py-14'>
        <NewsList news={news} lng={lng} />
      </HawkStarsSection>
    </>
  );
};

export default NewsIndexPage;
