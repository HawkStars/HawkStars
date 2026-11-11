import { ReactNode } from 'react';
import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';
import type { PaginatedDocs } from 'payload';
import { Language } from '@/i18n/settings';
import ListFilters, { ListFilterConfig } from '@/components/utils/ListFilters';
import { ContentSection } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { transformUrl } from '@/utils/paths';
import SectionHeader from '@/components/ui/SectionHeader';
import { LISTING_GRID } from './ListingCard';
import ListingEmpty from './ListingEmpty';

type SplitListTranslations = {
  upcoming: string;
  noUpcoming: string;
  // Heading for items happening right now (events only). Falls back to `upcoming`.
  current?: string;
  // Shown in the empty state so "nothing upcoming" leads somewhere instead of ending the page.
  viewArchive?: string;
  viewArchiveDescription?: string;
};

type SplitListProps<T> = {
  // Past items no longer live here -- they moved to their own paginated
  // archive page (see ArchiveListComponent). The archive/agenda CTAs that
  // used to live here moved up into the page's HeroImpactStatsBlock instead,
  // so this component only needs the upcoming/current lists and their labels.
  items: { upcoming: T[]; current?: PaginatedDocs<T> };
  // Used to localise the archive link in the empty state.
  lng: Language;
  translations: SplitListTranslations;
  /** `featured` is true for the first item of each list, which spans the grid row. */
  renderCard: (item: T, index: number, featured: boolean) => ReactNode;
  filters?: ListFilterConfig[];
  // Section-relative archive path (e.g. SITE_GET_URLS.projects_archive). When set, the
  // empty state links to it.
  archiveUrl?: string;
};

const SplitListComponent = <T,>({
  items,
  lng,
  translations,
  renderCard,
  filters,
  archiveUrl,
}: SplitListProps<T>) => {
  const { upcoming, current } = items || {};
  const { docs } = current || {};

  const {
    upcoming: upcomingLabel,
    noUpcoming,
    current: currentLabel,
    viewArchive,
    viewArchiveDescription,
  } = translations;
  const showArchiveLink = Boolean(archiveUrl && viewArchive);

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
            <SectionHeader title={currentLabel || upcomingLabel} className='mb-8' />
            <div className={LISTING_GRID}>
              {docs.map((item, idx) => renderCard(item, idx, idx === 0))}
            </div>
          </section>
        )}

        {/* Upcoming */}
        <section>
          <SectionHeader title={upcomingLabel} className='mb-8' />
          {upcoming.length === 0 ? (
            <ListingEmpty
              title={noUpcoming}
              description={showArchiveLink ? viewArchiveDescription : undefined}
              action={
                showArchiveLink &&
                archiveUrl && (
                  <Button asChild variant='outline'>
                    <Link href={transformUrl(lng, archiveUrl)}>
                      {viewArchive}
                      <LuArrowRight aria-hidden='true' />
                    </Link>
                  </Button>
                )
              }
            />
          ) : (
            <div className={LISTING_GRID}>
              {upcoming.map((item, idx) => renderCard(item, idx, idx === 0))}
            </div>
          )}
        </section>
      </div>
    </ContentSection>
  );
};

export default SplitListComponent;
