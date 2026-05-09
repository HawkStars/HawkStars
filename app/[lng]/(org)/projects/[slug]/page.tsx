import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleEventsQuery } from '@/lib/payload/queries/event';
import { getNewsByProjectId } from '@/lib/payload/queries/news';
import ProjectPage from '@/components/projects/ProjectPage';
import ProjectNewsSection from '@/components/projects/ProjectNewsSection';

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

  const relatedNews = await getNewsByProjectId(event.id, lng as Language);

  return (
    <>
      <ProjectPage project={event} />
      <ProjectNewsSection news={relatedNews} lng={lng} />
    </>
  );
};

export default EventPage;
