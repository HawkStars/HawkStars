'use client';

import { News } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { format } from 'date-fns';
import Link from 'next/link';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { Badge } from '@/components/ui/badge';
import { transformUrl, SITE_GET_URLS } from '@/utils/paths';
import { HawkStarsSection } from '@/components/layout';
import { NewsTypeLabels } from '../constants';
import { useTranslation } from '@/i18n/client';
import LandingPagination from '@/components/utils/Pagination';
import { Language } from '@/i18n/settings';
import { cn } from '@/lib/utils';

type NewsListProps = {
  news: PaginatedDocs<News>;
  lng: Language;
};

const NewsListComponent = ({ news, lng }: NewsListProps) => {
  const { t } = useTranslation(lng, 'common');
  const { docs, totalPages, page, hasPrevPage, hasNextPage, limit } = news || {};

  debugger;
  const docsWithImage = docs.filter((doc) => !!doc.mainImage?.image);
  const docsWithoutImage = docs.filter((doc) => !doc.mainImage?.image);

  return (
    <HawkStarsSection className='flex-col py-10 lg:py-14'>
      {/* <ListFilters on /> */}
      <div className='grid gap-x-1 gap-y-5 lg:grid-cols-3'>
        {docsWithImage?.map((article, articleIndex) => {
          const image = getImagePayloadUrl(article.mainImage);
          const articleUrl = transformUrl(lng, `${SITE_GET_URLS.news}/${article.slug}`);

          return (
            <article key={article.id}>
              <Link
                href={articleUrl}
                className={cn('group flex h-full flex-col overflow-hidden rounded-xl', {
                  'bg-bege-light': !image,
                })}
              >
                <div className='relative aspect-4/3 w-full overflow-hidden'>
                  <ImageMedia
                    resource={article.mainImage}
                    alt={image?.alt || article.title}
                    fill
                    className='ml-auto object-contain'
                    preload={articleIndex <= 2}
                    sizes='(max-width: 1024px) 100vw, 33vw'
                  />
                </div>
                <div className='flex flex-1 flex-col gap-3 p-5'>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline'>{NewsTypeLabels[article.type]}</Badge>
                    {article.publishedAt && (
                      <span className='text-muted-foreground text-xs'>
                        {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                  <h2 className='line-clamp-2 text-lg font-semibold group-hover:underline'>
                    {article.title}
                  </h2>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      <div>
        {docsWithoutImage?.map((article) => {
          const articleUrl = transformUrl(lng, `${SITE_GET_URLS.news}/${article.slug}`);
          return (
            <article key={article.id}>
              <Link
                href={articleUrl}
                className={cn('group flex h-full flex-col overflow-hidden rounded-xl')}
              >
                <div className='flex flex-1 flex-col gap-3 p-5'>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline'>{NewsTypeLabels[article.type]}</Badge>
                    {article.publishedAt && (
                      <span className='text-muted-foreground text-xs'>
                        {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                  <h2 className='line-clamp-2 text-lg font-semibold group-hover:underline'>
                    {article.title}
                  </h2>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <LandingPagination
          t={t}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          lng={lng}
          page={page}
          totalPages={totalPages}
          url={SITE_GET_URLS.news}
          limit={limit}
        />
      )}
    </HawkStarsSection>
  );
};

export default NewsListComponent;
