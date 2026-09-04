import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { Language } from '@/i18n/settings';
import { prepareMetadataInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleHawkEventQuery } from '@/lib/payload/queries/hawkEvent';
import EventPage from '@/components/events/EventPage';
import { EventJsonLd } from '@/components/seo/JsonLd';
import { BASE_URL } from '@/lib/constants';
import { Suspense } from 'react';
import { getImagePayloadUrl } from '@/lib/image';

export async function generateMetadata(props: EventPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;

  const event = await getSingleHawkEventQuery(slug, lng as Language);
  if (!event) return {};

  return prepareMetadataInfo({
    title: event.heading || '',
    description: event.subheading || event.description,
    image: event.image,
    url: `/events/${slug}`,
    lng: lng as Language,
  });
}

type EventPageProps = { params: Promise<LanguageProps & { slug: string }> };

// Non-async shell so the <Suspense> boundary exists before `params` — a dynamic
// API on this route, since `[slug]` has no `generateStaticParams` — is awaited.
const SingleEventPage = (props: EventPageProps) => (
  <Suspense fallback={<></>}>
    <EventContent params={props.params} />
  </Suspense>
);

const EventContent = async ({ params }: { params: EventPageProps['params'] }) => {
  const { slug, lng } = await params;
  if (!slug) return notFound();

  const event = await getSingleHawkEventQuery(slug, lng);
  if (!event) notFound();

  const image = await getImagePayloadUrl(event.image);

  return (
    <>
      <EventJsonLd
        name={event.heading ?? slug}
        description={event.description || ''}
        startDate={event.date ?? event.createdAt}
        endDate={event.endDate ?? undefined}
        location={undefined}
        url={`${BASE_URL}/${lng}/events/${slug}`}
        image={image?.url ?? undefined}
      />
      <EventPage event={event} lng={lng} />
    </>
  );
};

export default SingleEventPage;
