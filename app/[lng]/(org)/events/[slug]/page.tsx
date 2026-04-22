import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleHawkEventQuery } from '@/lib/payload/queries/hawkEvent';
import EventPage from '@/components/events/EventPage';

export async function generateMetadata(props: EventPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;

  const metadataPage = getMetadataPageInfo(lng as Language, 'events');
  return metadataPage;
}

type EventPageProps = { params: Promise<LanguageProps & { slug: string }> };

const SingleEventPage = async (props: EventPageProps) => {
  const params = await props.params;
  const { slug, lng } = params;
  if (!slug) return notFound();

  const event = await getSingleHawkEventQuery(slug, lng);
  if (!event) notFound();

  return <EventPage event={event} />;
};

export default SingleEventPage;
