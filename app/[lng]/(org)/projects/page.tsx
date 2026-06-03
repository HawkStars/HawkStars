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

export const revalidate = 600; // invalidate every 10 minutes

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

const EventsPage = async (props: EventsPageProps) => {
  const params = await props.params;
  const { lng } = params;

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
