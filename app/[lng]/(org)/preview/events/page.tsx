import { Metadata } from 'next';
import { Language } from '@/i18n/settings';
import { connection } from 'next/server';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { getServerTranslation } from '@/i18n';
import { getEventsListHeaderInfo } from '@/lib/payload/queries/globals/eventsList';
import { getHawkEventsSplitByDate } from '@/lib/payload/queries/hawkEvent';
import { LivePreviewEventsList } from '@/payload/components/LivePreview/globals/LivePreviewEventsList';

export async function generateMetadata(): Promise<Metadata> {
  return { robots: 'noindex, nofollow' };
}

type HomeProps = {
  params: Promise<{ lng: Language }>;
};

export default async function PreviewProjectsList(props: HomeProps) {
  await connection();
  const params = await props.params;
  const { lng } = params;

  const [eventsListInformation, events, { t }] = await Promise.all([
    getEventsListHeaderInfo(lng),
    getHawkEventsSplitByDate(lng as Language),
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

  if (!eventsListInformation) return null;

  return (
    <LivePreviewEventsList
      initialData={{ eventsListInformation, events, translations }}
      serverURL={getServerSideURL()}
      lng={lng}
    />
  );
}
