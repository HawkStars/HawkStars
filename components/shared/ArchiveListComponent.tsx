import { ReactNode } from 'react';
import { PaginatedDocs } from 'payload';
import { TFunction } from 'i18next';
import { Language } from '@/i18n/settings';
import LandingPagination from '@/components/utils/Pagination';
import { ContentSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import ListFilters, { ListFilterConfig } from '@/components/utils/ListFilters';

type ArchiveListProps<T> = {
  items: PaginatedDocs<T>;
  lng: Language;
  title: string;
  emptyLabel: string;
  renderCard: (item: T, index: number) => ReactNode;
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
        <SectionHeader as='h1' title={title} titleClassName='text-h2_semibold' />
        {filters && filters.length > 0 && <ListFilters filters={filters} />}
        {docs.length === 0 ? (
          <p className='text-muted-foreground text-body_regular'>{emptyLabel}</p>
        ) : (
          <div className='flex flex-col gap-6'>
            {docs.map((item, idx) => renderCard(item, idx))}
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
