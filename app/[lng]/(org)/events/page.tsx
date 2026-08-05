import HeroImpactStatsBlock from '@/components/projects/list/HeroImpactStatsBlock';
import SplitListComponent from '@/components/shared/SplitListComponent';
import EventCard from '@/components/events/list/EventCard';
import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getHawkEventsSplitByDate } from '@/lib/payload/queries/hawkEvent';
import { getEventsListHeaderInfo } from '@/lib/payload/queries/globals/eventsList';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';

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
    upcoming: t('upcomingEvents'),
    past: t('pastEvents'),
    noUpcoming: t('noUpcomingEvents'),
    noPast: t('noPastEvents'),
    viewAgenda: t('viewAgenda'),
    viewAgendaDescription: t('viewAgendaDescription'),
  };

  if (!eventsListInformation) return null;

  return (
    <>
      <HeroImpactStatsBlock {...eventsListInformation} />
      <SplitListComponent
        items={events}
        lng={lng}
        translations={translations}
        renderCard={(event, idx) => (
          <EventCard key={event.id} event={event} index={idx} lng={lng} />
        )}
      />
    </>
  );
};

export default EventsPage;
