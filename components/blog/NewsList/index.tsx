import { News } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { getImagePayloadUrl } from '@/lib/image';
import { Badge } from '@/components/ui/badge';
import { transformUrl, urls } from '@/utils/paths';

type NewsListProps = {
  news: PaginatedDocs<News>;
  lng: string;
};

const NewsTypeLabels: Record<News['type'], string> = {
  blog: 'Blog',
  news: 'News',
  press_release: 'Press Release',
  announcement: 'Announcement',
  other: 'Other',
};

const NewsList = ({ news, lng }: NewsListProps) => {
  const { docs, totalPages, page, hasPrevPage, hasNextPage } = news;

  return (
    <div>
      <div className='flex flex-col gap-6'>
        {docs.map((article) => {
          const image = getImagePayloadUrl(article.mainImage);
          const articleUrl = transformUrl(lng, `${urls.news}/${article.slug}`);

          return (
            <article
              key={article.id}
              className='border-bege-dark flex flex-col overflow-hidden border-b-2'
            >
              {image?.url && (
                <Link href={articleUrl} className='block aspect-video overflow-hidden'>
                  <Image
                    src={image.url}
                    alt={image.alt || article.title}
                    width={600}
                    height={338}
                    className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
                  />
                </Link>
              )}
              <div className='flex flex-1 flex-col gap-3 p-5'>
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary'>{NewsTypeLabels[article.type]}</Badge>
                  {article.publishedAt && (
                    <span className='text-muted-foreground text-xs'>
                      {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
                <Link href={articleUrl} className='hover:underline'>
                  <h2 className='line-clamp-2 text-lg font-semibold'>{article.title}</h2>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav className='mt-10 flex items-center justify-center gap-2' aria-label='Pagination'>
          {hasPrevPage && (
            <Link
              href={`${transformUrl(lng, urls.news)}?page=${(page ?? 1) - 1}`}
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
              href={`${transformUrl(lng, urls.news)}?page=${(page ?? 1) + 1}`}
              className='rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100'
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
};

export default NewsList;
