import { ReactNode } from 'react';
import type { PaginatedDocs } from 'payload';
import { TFunction } from 'i18next';
import { Language } from '@/i18n/settings';
import LandingPagination from '@/components/utils/Pagination';
import { ContentSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import ListFilters, { ListFilterConfig } from '@/components/utils/ListFilters';
import { LuArchive } from 'react-icons/lu';
import { LISTING_GRID } from './ListingCard';
import ListingEmpty from './ListingEmpty';

type ArchiveListProps<T> = {
  items: PaginatedDocs<T>;
  lng: Language;
  title: string;
  emptyLabel: string;
  /** Archives are a plain grid, so `featured` is always false here. */
  renderCard: (item: T, index: number, featured: boolean) => ReactNode;
  // The "common" namespace TFunction, for <LandingPagination>'s pagination.*
  // strings -- see the equivalent note on SplitListComponent for why this is
  // a plain prop rather than a useTranslation() call inside this component.
  t: TFunction<string, undefined>;
  url: string;
  filters?: ListFilterConfig[];
};

const ArchiveListComponent = <T,>({
  items,
  lng,
  title,
  emptyLabel,
  renderCard,
  t,
  url,
  filters,
}: ArchiveListProps<T>) => {
  const { docs, totalPages, page, hasPrevPage, hasNextPage, limit } = items;

  return (
    <ContentSection>
      <div className='flex flex-col gap-8'>
        <SectionHeader as='h1' title={title} titleClassName='text-display' />
        {filters && filters.length > 0 && <ListFilters filters={filters} />}
        {docs.length === 0 ? (
          <ListingEmpty title={emptyLabel} icon={LuArchive} />
        ) : (
          <div className={LISTING_GRID}>
            {docs.map((item, idx) => renderCard(item, idx, false))}
          </div>
        )}
        {totalPages > 1 && (
          <LandingPagination
            t={t}
            lng={lng}
            url={url}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            page={page}
            totalPages={totalPages}
            limit={limit}
          />
        )}
      </div>
    </ContentSection>
  );
};

export default ArchiveListComponent;
