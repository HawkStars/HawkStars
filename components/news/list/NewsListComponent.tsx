'use client';

import { News } from '@/payload-types';
import type { PaginatedDocs } from 'payload';
import { SITE_GET_URLS } from '@/utils/paths';
import { ContentSection } from '@/components/layout';
import NewsCard from '../NewsCard';
import { useTranslation } from '@/i18n/client';
import LandingPagination from '@/components/utils/Pagination';
import ListFilters, { ListFilterConfig } from '@/components/utils/ListFilters';
import { Language } from '@/i18n/settings';

type NewsListProps = {
  news: PaginatedDocs<News>;
  lng: Language;
  filters?: ListFilterConfig[];
};

const NewsListComponent = ({ news, lng, filters }: NewsListProps) => {
  const { t } = useTranslation(lng, 'common');
  const { docs, totalPages, page, hasPrevPage, hasNextPage, limit } = news || {};

  return (
    <ContentSection>
      <div className='flex flex-col gap-8'>
        {filters && filters.length > 0 && <ListFilters filters={filters} />}
        {/* One grid in date order: articles without an image get a placeholder frame
            instead of being split off into a separate list below. */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {docs.map((article, index) => (
            <NewsCard key={article.id} article={article} lng={lng} preload={index < 3} />
          ))}
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
      </div>
    </ContentSection>
  );
};

export default NewsListComponent;
