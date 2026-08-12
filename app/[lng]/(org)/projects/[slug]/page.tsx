import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo, prepareMetadataInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleProjectsQuery } from '@/lib/payload/queries/projects';
import { getImagePayloadUrl } from '@/lib/image';
import NewsSingleGallery from '@/components/news/single/NewsSingleGallery';
import ProjectsSingleHero from '@/components/projects/single/ProjectsSingleHero';
import SingleProjectObjectives from '@/components/projects/single/SingleProjectObjectives';
import SingleProjectPartners from '@/components/projects/single/SingleProjectPartners';
import SingleProjectPhases from '@/components/projects/single/SingleProjectPhases';
import SingleProjectReports from '@/components/projects/single/SingleProjectReports';
import SingleProjectResults from '@/components/projects/single/SingleProjectResults';
import SingleProjectTravelMapWrapper from '@/components/projects/single/SingleProjectTravelMapWrapper';
import { Suspense } from 'react';

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

const ProjectServerPage = (props: ProjectPageProps) => (
  <Suspense fallback={<></>}>
    <ProjectContent params={props.params} />
  </Suspense>
);

const ProjectContent = async ({ params }: { params: ProjectPageProps['params'] }) => {
  const { slug, lng } = await params;
  if (!slug) return notFound();

  const project = await getSingleProjectsQuery(slug, lng);
  if (!project) notFound();

  return (
    <div>
      <ProjectsSingleHero {...project} lng={lng} />
      <SingleProjectTravelMapWrapper {...project} lng={lng} />
      <SingleProjectPhases details={project.details} />
      <SingleProjectPartners partnersInformation={project.partnersInformation} lng={lng} />
      <SingleProjectObjectives objectives={project.objectives} lng={lng} />
      <SingleProjectResults results={project.results} lng={lng} />
      <SingleProjectReports {...project} lng={lng} />
      <NewsSingleGallery gallery={project.gallery} />
    </div>
  );
};

export default ProjectServerPage;
