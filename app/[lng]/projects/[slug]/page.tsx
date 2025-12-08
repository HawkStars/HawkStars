import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleEventsQuery } from '@/lib/payload/queries/event';
import { Media } from '@/payload-types';
import Post from '@/components/blog/Post';

export async function generateMetadata(props: EventPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  // const event = await getSingleEventsQuery(slug);

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type EventPageProps = { params: Promise<LanguageProps & { slug: string }> };

const EventPage = async (props: EventPageProps) => {
  const params = await props.params;
  const { slug } = params;
  if (!slug) return notFound();

  const event = await getSingleEventsQuery(slug);
  if (!event) notFound();

  return (
    <Post
      content={event.page_content || undefined}
      title={event.heading}
      image={(event?.image as Media)?.url || ''}
      pubDate={new Date(event.updatedAt)}
      description={event.description || undefined}
    />
  );
};

export default EventPage;
