import { News } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { getImagePayloadUrl } from '@/lib/image';
import { Badge } from '@/components/ui/badge';
import { transformUrl, urls } from '@/utils/paths';
import { HawkStarsSection } from '@/components/layout';
import { NewsTypeLabels } from '../constants';

type NewsListProps = {
  news: PaginatedDocs<News>;
  lng: string;
  projectSlug?: string;
};

const NewsListComponent = ({ news, lng, projectSlug }: NewsListProps) => {
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
                      <Image
                        src={image.url}
                        alt={image.alt || article.title}
                        fill
                        className='object-cover'
                        priority={articleIndex === 0}
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
        <nav className='mt-10 flex items-center justify-center gap-2' aria-label='Pagination'>
          {hasPrevPage && (
            <Link
              href={`${transformUrl(lng, urls.news)}?page=${(page ?? 1) - 1}${projectParam}`}
              className='rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100'
            >
              ← Previous
            </Link>
          )}
          <span className='text-muted-foreground text-sm'>
            Page {page} of {totalPages}
          </span>
          {hasNextPage && (
            <Link
              href={`${transformUrl(lng, urls.news)}?page=${(page ?? 1) + 1}${projectParam}`}
              className='rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100'
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </HawkStarsSection>
  );
};

export default NewsListComponent;
