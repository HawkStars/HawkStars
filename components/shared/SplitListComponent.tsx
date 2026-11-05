import { ReactNode } from 'react';
import Link from 'next/link';
import { LuArrowRight, LuCalendarClock } from 'react-icons/lu';
import type { PaginatedDocs } from 'payload';
import { Language } from '@/i18n/settings';
import ListFilters, { ListFilterConfig } from '@/components/utils/ListFilters';
import { ContentSection } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { transformUrl } from '@/utils/paths';

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
  renderCard: (item: T, index: number) => ReactNode;
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
            <div className='bg-bege-light border-bege-dark flex flex-col gap-5 rounded-xl border px-6 py-8 sm:flex-row sm:items-center'>
              <span className='bg-bege-dark flex size-14 shrink-0 items-center justify-center rounded-full'>
                <LuCalendarClock aria-hidden='true' className='text-green size-7' />
              </span>
              <div className='flex flex-1 flex-col gap-1'>
                <p className='text-body_semibold'>{noUpcoming}</p>
                {showArchiveLink && viewArchiveDescription && (
                  <p className='text-body_regular text-black/70'>{viewArchiveDescription}</p>
                )}
              </div>
              {showArchiveLink && archiveUrl && (
                <Button asChild variant='outline' className='self-start sm:self-center'>
                  <Link href={transformUrl(lng, archiveUrl)}>
                    {viewArchive}
                    <LuArrowRight aria-hidden='true' />
                  </Link>
                </Button>
              )}
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
