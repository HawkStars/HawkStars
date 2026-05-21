import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import ProjectPage from '@/components/projects/ProjectPage';
import { getSingleProjectsQuery } from '@/lib/payload/queries/projects';

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

  const project = await getSingleProjectsQuery(slug, lng);
  if (!project) notFound();

  return (
    <>
      <ProjectPage project={project} />
    </>
  );
};

export default EventPage;
