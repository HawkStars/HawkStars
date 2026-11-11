import HeroImpactStatsBlock from '@/components/projects/list/HeroImpactStatsBlock';
import SplitListComponent from '@/components/shared/SplitListComponent';
import EventCard from '@/components/events/list/EventCard';
import { EVENT_TYPES } from '@/components/events/constants';
import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getHawkEventsSplitByDate, getEventYearsQuery } from '@/lib/payload/queries/hawkEvent';
import { getEventsListHeaderInfo } from '@/lib/payload/queries/globals/eventsList';
import { HawkEvent } from '@/payload-types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { SITE_GET_URLS } from '@/utils/paths';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageLoading } from '@/components/layout';

export async function generateMetadata(props: EventsPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;

  // `?page=N` used to canonicalise to page 1, so Google treated pages 2..N as
  // duplicates of the first and dropped them. Filter params stay excluded.
  const pageNumber = Number((await props.searchParams)?.page) || undefined;
  const metadataPage = getMetadataPageInfo(lng as Language, 'events', pageNumber);
  return metadataPage;
}

type EventsPageProps = {
  params: Promise<LanguageProps>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

// Mirrors app/[lng]/(org)/projects/page.tsx exactly. The <Suspense> used to be
// returned *after* the awaits below, which defers nothing — every promise it was
// meant to cover had already resolved by the time React saw the element. The
// boundary has to be created before the data is requested, so the page component
// stays non-async and passes `params` down unawaited.
const EventsPage = (props: EventsPageProps) => (
  <Suspense fallback={<PageLoading />}>
    <EventsContent params={props.params} searchParams={props.searchParams} />
  </Suspense>
);

const EventsContent = async ({
  params,
  searchParams,
}: {
  params: EventsPageProps['params'];
  searchParams: EventsPageProps['searchParams'];
}) => {
  const [{ lng }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const type =
    typeof resolvedSearchParams.type === 'string'
      ? (resolvedSearchParams.type as NonNullable<HawkEvent['type_event']>)
      : undefined;

  const yearParam = Number(resolvedSearchParams.year);
  const year = Number.isFinite(yearParam) ? yearParam : undefined;

  const [eventsListInformation, events, years, { t }] = await Promise.all([
    getEventsListHeaderInfo(lng),
    getHawkEventsSplitByDate(lng as Language, { type, year }),
    getEventYearsQuery(lng as Language),
    getServerTranslation(lng, 'events'),
  ]);

  const translations = {
    upcoming: t('upcomingEvents'),
    current: t('currentEvents'),
    noUpcoming: t('noUpcomingEvents'),
    viewAgenda: t('viewAgenda'),
    viewAgendaDescription: t('viewAgendaDescription'),
    viewArchive: t('viewPastEvents'),
    viewArchiveDescription: t('viewPastEventsDescription'),
  };

  const filters = [
    {
      param: 'type',
      allLabel: t('allTypes'),
      value: type,
      options: EVENT_TYPES.map((value) => ({ value, label: t(`types.${value}`) })),
    },
    {
      param: 'year',
      allLabel: t('allYears'),
      value: year ? String(year) : undefined,
      options: years.map((y) => ({ value: String(y), label: String(y) })),
    },
  ];

  return (
    <>
      {/* The `events-list` global can exist without a title (e.g. never published, so
          only an empty draft is stored). Fall back to i18n rather than rendering a
          hero with no h1, or returning nothing at all when the global is missing. */}
      <HeroImpactStatsBlock
        {...eventsListInformation}
        title={eventsListInformation?.title || t('heroTitle')}
        subtitle={eventsListInformation?.subtitle || t('heroSubtitle')}
        viewAgenda={translations.viewAgenda}
        archiveUrl={SITE_GET_URLS.events_archive}
        viewArchive={translations.viewArchive}
      />
      <SplitListComponent
        items={events}
        lng={lng}
        translations={translations}
        filters={filters}
        archiveUrl={SITE_GET_URLS.events_archive}
        renderCard={(event, idx, featured) => (
          <EventCard
            key={event.id}
            event={event}
            index={idx}
            lng={lng as Language}
            featured={featured}
          />
        )}
      />
    </>
  );
};

export default EventsPage;
