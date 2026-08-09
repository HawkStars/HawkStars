import HeroImpactStatsBlock from '@/components/projects/list/HeroImpactStatsBlock';
import SplitListComponent from '@/components/shared/SplitListComponent';
import ProjectCard from '@/components/projects/list/ProjectCard';
import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getProjectsListHeaderInfo } from '@/lib/payload/queries/globals/projectsList';
import { getProjectsSplitByDate } from '@/lib/payload/queries/projects';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const instant = false;

export async function generateMetadata(props: EventsPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;

  const metadataPage = getMetadataPageInfo(lng as Language, 'projects');
  return metadataPage;
}

type EventsPageProps = {
  params: Promise<LanguageProps>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

// The page component is deliberately NOT `async` and awaits nothing: it exists
// only to establish the <Suspense> boundary before any data is requested.
//
// A boundary returned *after* awaiting (the previous shape here) defers
// nothing — by the time React sees the <Suspense> element, every promise it
// was meant to cover has already resolved, so the route still blocks and
// still can't be prerendered under `cacheComponents`. The `params` promise is
// therefore passed down unawaited and consumed inside the boundary.
const EventsPage = (props: EventsPageProps) => (
  <Suspense fallback={<></>}>
    <ProjectsContent params={props.params} />
  </Suspense>
);

const ProjectsContent = async ({ params }: { params: EventsPageProps['params'] }) => {
  const { lng } = await params;

  const [projectListInformation, projects, { t }] = await Promise.all([
    getProjectsListHeaderInfo(lng),
    getProjectsSplitByDate(lng as Language),
    getServerTranslation(lng, 'projects'),
  ]);

  const translations = {
    upcoming: t('upcomingProjects'),
    past: t('pastProjects'),
    noUpcoming: t('noUpcomingProjects'),
    noPast: t('noPastProjects'),
    viewAgenda: t('viewAgenda'),
    viewAgendaDescription: t('viewAgendaDescription'),
  };

  if (!projectListInformation) return null;

  return (
    <>
      <HeroImpactStatsBlock {...projectListInformation} />
      <SplitListComponent
        items={projects}
        lng={lng}
        translations={translations}
        renderCard={(project, idx) => (
          <ProjectCard key={project.id} project={project} index={idx} lng={lng} />
        )}
      />
    </>
  );
};

export default EventsPage;
