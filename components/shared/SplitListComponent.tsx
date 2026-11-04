import { ReactNode } from 'react';
import { LuCalendarClock } from 'react-icons/lu';
import type { PaginatedDocs } from 'payload';
import { Language } from '@/i18n/settings';
import ListFilters, { ListFilterConfig } from '@/components/utils/ListFilters';
import { ContentSection } from '@/components/layout';

type SplitListTranslations = {
  upcoming: string;
  noUpcoming: string;
  // Heading for items happening right now (events only). Falls back to `upcoming`.
  current?: string;
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

  const { upcoming: upcomingLabel, noUpcoming, current: currentLabel } = translations;

  return (
    <ContentSection>
      <div className='flex flex-col gap-12 lg:gap-16'>
        {/* Type/year filters */}
        {filters && filters.length > 0 && <ListFilters filters={filters} />}

        {/* Current Events -- only when something is happening now. Rendering it
            unconditionally (with the upcoming heading and empty state) duplicated
            the upcoming section whenever nothing was on. */}
        {docs && docs.length > 0 && (
          <section>
            <h2 className='text-h2_semibold mb-6'>{currentLabel || upcomingLabel}</h2>
            <div className='flex flex-col gap-6'>
              {docs.map((item, idx) => renderCard(item, idx))}
            </div>
          </section>
        )}

        {/* Upcoming */}
        <section>
          <h2 className='text-h2_semibold mb-6'>{upcomingLabel}</h2>
          {upcoming.length === 0 ? (
            <div className='bg-bege-light border-bege-dark flex items-center gap-4 rounded-xl border px-6 py-8'>
              <LuCalendarClock aria-hidden='true' className='text-green size-8 shrink-0' />
              <p className='text-body_regular text-black/70'>{noUpcoming}</p>
            </div>
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
