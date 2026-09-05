import { ReactNode } from 'react';
import { PaginatedDocs } from 'payload';
import { Language } from '@/i18n/settings';
import ListFilters, { ListFilterConfig } from '@/components/utils/ListFilters';
import { ContentSection } from '@/components/layout';

type SplitListTranslations = {
  upcoming: string;
  noUpcoming: string;
};

type SplitListProps<T> = {
  // Past items no longer live here -- they moved to their own paginated
  // archive page (see ArchiveListComponent). The archive/agenda CTAs that
  // used to live here moved up into the page's HeroImpactStatsBlock instead,
  // so this component only needs the upcoming/current lists and their labels.
  items: { upcoming: T[]; current?: PaginatedDocs<T> };
  // Still accepted (and passed by every call site) even though this component
  // no longer needs it directly -- kept so callers don't have to special-case
  // dropping it just for this component.
  lng: Language;
  translations: SplitListTranslations;
  renderCard: (item: T, index: number) => ReactNode;
  filters?: ListFilterConfig[];
};

const SplitListComponent = <T,>({
  items,
  translations,
  renderCard,
  filters,
}: SplitListProps<T>) => {
  const { upcoming, current } = items || {};
  const { docs } = current || {};

  const { upcoming: upcomingLabel, noUpcoming } = translations;

  return (
    <ContentSection>
      <div className='flex flex-col gap-12 lg:gap-16'>
        {/* Type/year filters */}
        {filters && filters.length > 0 && <ListFilters filters={filters} />}

        {/* Current Events */}
        {current && (
          <section>
            <h2 className='text-h2_semibold mb-6'>{upcomingLabel}</h2>
            {docs?.length === 0 ? (
              <p className='text-muted-foreground text-body_regular'>{noUpcoming}</p>
            ) : (
              <div className='flex flex-col gap-6'>
                {docs?.map((item, idx) => renderCard(item, idx))}
              </div>
            )}
          </section>
        )}

        {/* Upcoming */}
        <section>
          <h2 className='text-h2_semibold mb-6'>{upcomingLabel}</h2>
          {upcoming.length === 0 ? (
            <p className='text-muted-foreground text-body_regular'>{noUpcoming}</p>
          ) : (
            <div className='flex flex-col gap-6'>
              {upcoming.map((item, idx) => renderCard(item, idx))}
            </div>
          )}
        </section>
      </div>
    </ContentSection>
  );
};

export default SplitListComponent;
