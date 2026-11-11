'use client';

import { LuCalendarDays } from 'react-icons/lu';
import { News } from '@/payload-types';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { formatDate } from '@/utils/date';
import ListingCard from '@/components/shared/ListingCard';

type NewsCardProps = {
  article: Pick<News, 'id' | 'slug' | 'title' | 'type' | 'publishedAt' | 'mainImage' | 'lead'>;
  lng: Language;
  /** Load the image eagerly (the first row of a list). */
  preload?: boolean;
  /** Wide card spanning the grid row — the newest article on the first page. */
  featured?: boolean;
  headingLevel?: 'h2' | 'h3';
};

/**
 * News article teaser used by the news list and the "more news" strip, on the shared
 * `ListingCard`: type pill on the image, publication date, and a lead on featured cards.
 */
const NewsCard = ({
  article,
  lng,
  preload = false,
  featured = false,
  headingLevel = 'h2',
}: NewsCardProps) => {
  const { t } = useTranslation(lng, 'common');
  const date = formatDate(article.publishedAt, lng);

  return (
    <ListingCard
      href={transformUrl(lng, `${SITE_GET_URLS.news}/${article.slug}`)}
      title={article.title}
      image={article.mainImage}
      badge={article.type ? t(`label.${article.type}`) : null}
      meta={
        date
          ? [{ icon: LuCalendarDays, text: date, dateTime: article.publishedAt ?? undefined }]
          : []
      }
      description={featured ? article.lead : null}
      ctaLabel={t('blocks.readMore')}
      featured={featured}
      featuredLabel={t('blocks.latestNews')}
      preload={preload}
      headingLevel={headingLevel}
    />
  );
};

export default NewsCard;
