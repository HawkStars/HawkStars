import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo, prepareMetadataInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleHawkEventQuery } from '@/lib/payload/queries/hawkEvent';
import EventPage from '@/components/events/EventPage';
import { EventJsonLd } from '@/components/seo/JsonLd';
import { BASE_URL } from '@/lib/constants';

export const revalidate = 600; // invalidate every 10 minutes

export async function generateMetadata(props: EventPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;

  const event = await getSingleHawkEventQuery(slug, lng as Language);
  if (!event) return getMetadataPageInfo(lng as Language, 'events');

  return prepareMetadataInfo({
    title: event.meta?.title ?? event.title ?? event.name,
    description: event.meta?.description ?? event.description,
    image: event.meta?.image ?? event.coverImage ?? event.image,
    urlPath: `/events/${slug}`,
    lng: lng as Language,
  });
}

type EventPageProps = { params: Promise<LanguageProps & { slug: string }> };

const SingleEventPage = async (props: EventPageProps) => {
  const params = await props.params;
  const { slug, lng } = params;
  if (!slug) return notFound();

  const event = await getSingleHawkEventQuery(slug, lng);
  if (!event) notFound();

  return (
    <>
      <EventJsonLd
        name={event.title ?? event.name ?? slug}
        description={event.description ?? event.meta?.description}
        startDate={event.date ?? event.startDate ?? event.createdAt}
        endDate={event.endDate ?? undefined}
        location={event.location ?? event.place ?? undefined}
        url={`${BASE_URL}/${lng}/events/${slug}`}
        image={event.coverImage?.url ?? event.image?.url ?? undefined}
      />
      <EventPage event={event} />
    </>
  );
};

export default SingleEventPage;
