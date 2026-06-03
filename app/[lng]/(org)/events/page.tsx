import HeroImpactStatsBlock from '@/components/projects/list/HeroImpactStatsBlock';
import EventsList from '@/components/events/list/EventsListComponent';
import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getHawkEventsSplitByDate } from '@/lib/payload/queries/hawkEvent';
import { getEventsListHeaderInfo } from '@/lib/payload/queries/globals/eventsList';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';

export const revalidate = 600; // invalidate every 10 minutes

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

const EventsPage = async (props: EventsPageProps) => {
  const params = await props.params;
  const { lng } = params;

  const [eventsListInformation, events, { t }] = await Promise.all([
    getEventsListHeaderInfo(lng),
    getHawkEventsSplitByDate(lng as Language),
    getServerTranslation(lng, 'events'),
  ]);

  const translations = {
    upcomingEvents: t('upcomingEvents'),
    pastEvents: t('pastEvents'),
    noUpcomingEvents: t('noUpcomingEvents'),
    noPastEvents: t('noPastEvents'),
    viewAgenda: t('viewAgenda'),
    viewAgendaDescription: t('viewAgendaDescription'),
    viewEvent: t('viewEvent'),
  };

  return (
    <>
      <HeroImpactStatsBlock {...eventsListInformation} />
      <EventsList events={events} lng={lng} translations={translations} />
    </>
  );
};

export default EventsPage;
