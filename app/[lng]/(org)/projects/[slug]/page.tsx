import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo, prepareMetadataInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import ProjectPage from '@/components/projects/ProjectPage';
import { getSingleProjectsQuery } from '@/lib/payload/queries/projects';
import { getImagePayloadUrl } from '@/lib/image';

export const revalidate = 600; // invalidate every 10 minutes

export async function generateMetadata(props: ProjectPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;

  const project = await getSingleProjectsQuery(slug, lng as Language);
  if (!project) return getMetadataPageInfo(lng as Language, 'projects');

  const image = getImagePayloadUrl(project.coverImage);
  const seoTitle = project.seo?.seo?.title ?? project.heading;
  const seoDescription = project.seo?.seo?.description ?? project.details?.text?.substring(0, 160);

  return prepareMetadataInfo({
    title: seoTitle,
    description: seoDescription,
    image: image?.url,
    urlPath: `/projects/${slug}`,
    lng: lng as Language,
  });
}

type ProjectPageProps = { params: Promise<LanguageProps & { slug: string }> };

const ProjectServerPage = async (props: ProjectPageProps) => {
  const params = await props.params;
  const { slug, lng } = params;
  if (!slug) return notFound();

  const project = await getSingleProjectsQuery(slug, lng);
  if (!project) notFound();

  return <ProjectPage project={project} />;
};

export default ProjectServerPage;
