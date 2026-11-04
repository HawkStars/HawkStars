'use client';

import Link from 'next/link';
import { News } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { getImagePayloadUrl } from '@/lib/image';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import logoMark from '@/public/images/logos/logo-mark.svg';
import { formatDate } from '@/utils/date';

type NewsCardProps = {
  article: Pick<News, 'id' | 'slug' | 'title' | 'type' | 'publishedAt' | 'mainImage'>;
  lng: Language;
  /** Load the image eagerly (the first row of a list). */
  preload?: boolean;
  headingLevel?: 'h2' | 'h3';
};

/**
 * News article teaser used by the news list and the "more news" strip. Every card has
 * the same 4:3 image frame, so posters and photos of any shape line up in a grid;
 * articles without an image show the Hawk Stars symbol instead of leaving a gap.
 */
const NewsCard = ({
  article,
  lng,
  preload = false,
  headingLevel: Heading = 'h2',
}: NewsCardProps) => {
  const { t } = useTranslation(lng, 'common');
  const image = getImagePayloadUrl(article.mainImage);
  const href = transformUrl(lng, `${SITE_GET_URLS.news}/${article.slug}`);

  const date = formatDate(article.publishedAt, lng);

  return (
    <article className='h-full'>
      <Link
        href={href}
        className='card card-hover group focus-visible:ring-green flex h-full flex-col overflow-hidden focus-visible:ring-2 focus-visible:outline-hidden'
      >
        <div className='bg-bege-light relative aspect-4/3 w-full overflow-hidden'>
          {image ? (
            <ImageMedia
              resource={article.mainImage}
              alt={image.alt || article.title}
              fill
              preload={preload}
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              className='object-cover object-top transition-transform duration-500 group-hover:scale-105'
            />
          ) : (
            <div className='flex h-full items-center justify-center'>
              <ImageMedia src={logoMark} alt='' width={88} className='opacity-30 grayscale' />
            </div>
          )}
        </div>

        <div className='flex flex-1 flex-col gap-3 p-5'>
          <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
            {article.type && (
              <span className='text-eyebrow text-terracotta-dark'>
                {t(`label.${article.type}`)}
              </span>
            )}
            {date && (
              <time dateTime={article.publishedAt ?? undefined} className='text-xs text-black/60'>
                {date}
              </time>
            )}
          </div>
          <Heading className='text-h3_semibold group-hover:text-green line-clamp-3 transition-colors'>
            {article.title}
          </Heading>
        </div>
      </Link>
    </article>
  );
};

export default NewsCard;
