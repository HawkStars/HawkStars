import { Language } from '@/i18n/settings';
import { transformUrl } from '@/utils/paths';
import { TFunction } from 'i18next';
import Link from 'next/link';
import { FC } from 'react';

type LandingPaginationProps = {
  t: TFunction<string, undefined>;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  lng: Language;
  page?: number;
  totalPages: number;
  url: string;
  limit: number;
  // Lets more than one independent paginated list live on the same page/URL
  // (e.g. "upcoming" and "past" on the projects/events pages) without one
  // list's page link wiping out the other list's query params -- the other
  // list's current page/limit gets folded into `extraParams`, and this list
  // writes to its own `pageParam`/`limitParam` instead of the shared
  // "page"/"limit" that a single-list page (e.g. /news) is happy to use.
  pageParam?: string;
  limitParam?: string;
  extraParams?: Record<string, string | number>;
};

const LandingPagination: FC<LandingPaginationProps> = ({
  hasNextPage,
  hasPrevPage,
  t,
  lng,
  page,
  totalPages,
  url,
  limit,
  pageParam = 'page',
  limitParam = 'limit',
  extraParams,
}) => {
  const buildHref = (targetPage: number) =>
    transformUrl(lng, url, {
      ...extraParams,
      [pageParam]: targetPage,
      [limitParam]: limit,
    });

  return (
    <nav
      className='mt-10 flex items-center justify-between gap-2'
      aria-label={t('pagination.label')}
    >
      {hasPrevPage && (
        <Link
          href={buildHref((page ?? 1) - 1)}
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
          href={buildHref((page ?? 1) + 1)}
          className='rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100'
        >
          {t('pagination.next')} →
        </Link>
      )}
    </nav>
  );
};

export default LandingPagination;
