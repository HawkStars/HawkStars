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
}) => {
  return (
    <nav
      className='mt-10 flex items-center justify-between gap-2'
      aria-label={t('pagination.label')}
    >
      {hasPrevPage && (
        <Link
          href={`${transformUrl(lng, url, { page: (page ?? 1) - 1, limit: limit })}`}
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
          href={`${transformUrl(lng, url, { page: (page ?? 1) + 1, limit: limit })}`}
          className='rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100'
        >
          {t('pagination.next')} →
        </Link>
      )}
    </nav>
  );
};

export default LandingPagination;
