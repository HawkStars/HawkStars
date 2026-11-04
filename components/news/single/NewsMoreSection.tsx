import Link from 'next/link';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { getNewsQuery } from '@/lib/payload/queries/news';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import NewsCard from '../NewsCard';

type NewsMoreSectionProps = {
  currentSlug: string;
  lng: Language;
};

const MORE_COUNT = 3;

/** The latest other articles, under a news article, so a reader has somewhere to go next. */
const NewsMoreSection = async ({ currentSlug, lng }: NewsMoreSectionProps) => {
  // One extra in case the current article is among the latest.
  const [{ docs }, { t }] = await Promise.all([
    getNewsQuery(lng, { page: 1, limit: MORE_COUNT + 1 }),
    getServerTranslation(lng, 'common'),
  ]);
  const others = docs.filter((doc) => doc.slug !== currentSlug).slice(0, MORE_COUNT);
  if (others.length === 0) return null;

  return (
    <HawkStarsSection spacing='default' className='bg-bege-light'>
      <div className='mb-10 flex flex-wrap items-end justify-between gap-4'>
        <SectionHeader title={t('article.moreNews')} />
        <Button asChild variant='outline'>
          <Link href={transformUrl(lng, SITE_GET_URLS.news)}>{t('article.allNews')}</Link>
        </Button>
      </div>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {others.map((article) => (
          <NewsCard key={article.id} article={article} lng={lng} headingLevel='h3' />
        ))}
      </div>
    </HawkStarsSection>
  );
};

export default NewsMoreSection;
