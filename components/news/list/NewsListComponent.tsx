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
import { LuNewspaper } from 'react-icons/lu';
import { LISTING_GRID } from '@/components/shared/ListingCard';
import ListingEmpty from '@/components/shared/ListingEmpty';

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
            instead of being split off into a separate list below. The newest article on
            the first page is featured across the full row. */}
        {docs.length === 0 ? (
          <ListingEmpty
            title={t('newsList.empty')}
            description={t('newsList.emptyHint')}
            icon={LuNewspaper}
          />
        ) : (
          <div className={LISTING_GRID}>
            {docs.map((article, index) => (
              <NewsCard
                key={article.id}
                article={article}
                lng={lng}
                preload={index < 3}
                featured={page === 1 && index === 0}
              />
            ))}
          </div>
        )}

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
