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

export async function generateMetadata(props: EventsPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;

  const metadataPage = getMetadataPageInfo(lng as Language, 'events');
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
  <Suspense fallback={<></>}>
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
  const year = resolvedSearchParams.year ? Number(resolvedSearchParams.year) : undefined;

  const [eventsListInformation, events, years, { t }] = await Promise.all([
    getEventsListHeaderInfo(lng),
    getHawkEventsSplitByDate(lng as Language, { type, year }),
    getEventYearsQuery(lng as Language),
    getServerTranslation(lng, 'events'),
  ]);

  const translations = {
    upcoming: t('upcomingEvents'),
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

  if (!eventsListInformation) return null;

  return (
    <>
      <HeroImpactStatsBlock
        {...eventsListInformation}
        viewAgenda={translations.viewAgenda}
        archiveUrl={SITE_GET_URLS.events_archive}
        viewArchive={translations.viewArchive}
      />
      <SplitListComponent
        items={events}
        lng={lng}
        translations={translations}
        filters={filters}
        renderCard={(event, idx) => (
          <EventCard key={event.id} event={event} index={idx} lng={lng} />
        )}
      />
    </>
  );
};

export default EventsPage;
