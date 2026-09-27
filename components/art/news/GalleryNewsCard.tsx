import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { News } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { Placard } from '../ui';
import { readingMinutes, richTextToPlain } from '../artwork/helpers';

const galleryNewsUrl = (lng: string, article: Pick<News, 'slug'>) =>
  transformUrl(lng, `${SITE_GET_URLS.gallery_news}/${article.slug}`);

export const formatNewsDate = (date: string | null | undefined, lng: string) =>
  date
    ? new Intl.DateTimeFormat(lng === 'en' ? 'en-GB' : 'pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(date))
    : null;

export async function GalleryNewsCard({ article, lng }: { article: News; lng: Language }) {
  const { t } = await getServerTranslation(lng, 'art');
  const href = galleryNewsUrl(lng, article);
  const excerpt = richTextToPlain(article.details?.text, 160);

  return (
    <article className='group border-art-line bg-art-wall hover:border-art-gold/50 flex h-full flex-col border transition-colors'>
      <Link href={href} className='bg-art-ebony relative block aspect-video overflow-hidden'>
        <ImageMedia
          resource={article.mainImage}
          alt={article.title}
          fill
          sizes='(max-width: 768px) 100vw, 33vw'
          className='object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100'
        />
        <Placard className='absolute top-3 left-3 uppercase'>
          {t(`news.types.${article.type}`)}
        </Placard>
      </Link>
      <div className='flex flex-1 flex-col gap-3 p-6'>
        <p className='text-art-muted flex items-center gap-2 text-xs tracking-wider'>
          {article.publishedAt && (
            <>
              <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt, lng)}</time>
              <span aria-hidden>•</span>
            </>
          )}
          {t('news.reading_time', { count: readingMinutes(article.details?.text) })}
        </p>
        <h3 className='font-art-serif text-art-text text-xl leading-snug'>
          <Link href={href} className='hover:text-art-gold-bright'>
            {article.title}
          </Link>
        </h3>
        {excerpt && <p className='text-art-text-2 line-clamp-3 text-sm'>{excerpt}</p>}
        <div className='border-art-line mt-auto flex items-center justify-between gap-3 border-t pt-4'>
          <p className='font-art-serif text-art-text-2 text-sm italic'>{article.galleryCardNote}</p>
          <Link
            href={href}
            className='text-art-gold-bright hover:text-art-text flex shrink-0 items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase'
          >
            {t('news.read')}
            <LuArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
