import ArchiveListComponent from '@/components/shared/ArchiveListComponent';
import EventCard from '@/components/events/list/EventCard';
import { EVENT_TYPES } from '@/components/events/constants';
import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getPastEvents, getEventYearsQuery } from '@/lib/payload/queries/hawkEvent';
import { HawkEvent } from '@/payload-types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { SITE_GET_URLS } from '@/utils/paths';
import { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateMetadata(props: EventsArchivePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;

  const metadataPage = getMetadataPageInfo(lng as Language, 'events_archive');
  return metadataPage;
}

type EventsArchivePageProps = {
  params: Promise<LanguageProps>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

// Mirrors app/[lng]/(org)/projects/archive/page.tsx exactly.
const EventsArchivePage = (props: EventsArchivePageProps) => (
  <Suspense fallback={<></>}>
    <EventsArchiveContent params={props.params} searchParams={props.searchParams} />
  </Suspense>
);

const EventsArchiveContent = async ({
  params,
  searchParams,
}: {
  params: EventsArchivePageProps['params'];
  searchParams: EventsArchivePageProps['searchParams'];
}) => {
  const [{ lng }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
  const limit = resolvedSearchParams.limit ? Number(resolvedSearchParams.limit) : undefined;
  const type =
    typeof resolvedSearchParams.type === 'string'
      ? (resolvedSearchParams.type as NonNullable<HawkEvent['type_event']>)
      : undefined;
  const year = resolvedSearchParams.year ? Number(resolvedSearchParams.year) : undefined;

  const [pastEvents, years, { t }, { t: commonT }] = await Promise.all([
    getPastEvents(lng as Language, { page, limit, type, year }),
    getEventYearsQuery(lng as Language),
    getServerTranslation(lng, 'events'),
    getServerTranslation(lng, 'common'),
  ]);

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
    <ArchiveListComponent
      items={pastEvents}
      lng={lng}
      title={t('pastEvents')}
      emptyLabel={t('noPastEvents')}
      t={commonT}
      url={SITE_GET_URLS.events_archive}
      filters={filters}
      renderCard={(event, idx) => <EventCard key={event.id} event={event} index={idx} lng={lng} />}
    />
  );
};

export default EventsArchivePage;
