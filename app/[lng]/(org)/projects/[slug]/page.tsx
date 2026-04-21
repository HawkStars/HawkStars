import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleEventsQuery } from '@/lib/payload/queries/event';
import ProjectPage from '@/components/projects/ProjectPage';

export async function generateMetadata(props: EventPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type EventPageProps = { params: Promise<LanguageProps & { slug: string }> };

const EventPage = async (props: EventPageProps) => {
  const params = await props.params;
  const { slug, lng } = params;
  if (!slug) return notFound();

  const event = await getSingleEventsQuery(slug, lng);
  if (!event) notFound();

  return <ProjectPage project={event} />;
};

export default EventPage;
