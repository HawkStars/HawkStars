'use client';

import { News } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { format } from 'date-fns';
import Link from 'next/link';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { Badge } from '@/components/ui/badge';
import { transformUrl, urls } from '@/utils/paths';
import { HawkStarsSection } from '@/components/layout';
import { NewsTypeLabels } from '../constants';
import { useTranslation } from '@/i18n/client';

type NewsListProps = {
  news: PaginatedDocs<News>;
  lng: string;
  projectSlug?: string;
};

const NewsListComponent = ({ news, lng, projectSlug }: NewsListProps) => {
  const { t } = useTranslation(lng, 'common');
  const { docs, totalPages, page, hasPrevPage, hasNextPage } = news || {};
  const projectParam = projectSlug ? `&project=${projectSlug}` : '';

  return (
    <HawkStarsSection className='py-10 lg:py-14'>
      <div className='flex w-full flex-col gap-6'>
        {docs &&
          docs.map((article, articleIndex) => {
            const image = getImagePayloadUrl(article.mainImage);
            const articleUrl = transformUrl(lng, `${urls.news}/${article.slug}`);

            return (
              <article key={article.id} className='border-bege-dark flex border-b-2'>
                <Link href={articleUrl} className='relative flex w-full gap-2'>
                  <div className='flex flex-1 flex-col gap-3 p-5'>
                    <div className='flex items-center gap-2'>
                      <Badge variant='secondary'>{NewsTypeLabels[article.type]}</Badge>
                      {article.publishedAt && (
                        <span className='text-muted-foreground text-xs'>
                          {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                    <h2 className='line-clamp-2 text-lg font-semibold'>{article.title}</h2>
                  </div>
                  {image?.url && (
                    <div className='relative h-24 w-32 shrink-0 self-center lg:h-28 lg:w-40'>
                      <ImageMedia
                        resource={article.mainImage}
                        alt={image.alt || article.title}
                        fill
                        className='object-cover'
                        preload={articleIndex === 0}
                        sizes='(max-width: 1024px) 128px, 160px'
                      />
                    </div>
                  )}
                </Link>
              </article>
            );
          })}
      </div>

      {totalPages > 1 && (
        <nav
          className='mt-10 flex items-center justify-center gap-2'
          aria-label={t('pagination.label')}
        >
          {hasPrevPage && (
            <Link
              href={`${transformUrl(lng, urls.news)}?page=${(page ?? 1) - 1}${projectParam}`}
              className='rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100'
            >
              ← {t('pagination.previous')}
            </Link>
          )}
          <span className='text-muted-foreground text-sm'>
            {t('pagination.pageOf', { page, total: totalPages })}
          </span>
          {hasNextPage && (
            <Link
              href={`${transformUrl(lng, urls.news)}?page=${(page ?? 1) + 1}${projectParam}`}
              className='rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100'
            >
              {t('pagination.next')} →
            </Link>
          )}
        </nav>
      )}
    </HawkStarsSection>
  );
};

export default NewsListComponent;
