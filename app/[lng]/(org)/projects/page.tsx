import { HawkStarsSection } from '@/components/layout';
import { HeroImpactStatsBlock } from '@/components/projects/HeroImpactStats';
import ProjectsList from '@/components/projects/ProjectsList';
import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getProjectsSplitByDate } from '@/lib/payload/queries/event';
import { getProjectsListHeaderInfo } from '@/lib/payload/queries/globals/projectsList';
import { VideoBlock } from '@/payload/blocks/VideoBlock/Component';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';

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
    upcomingProjects: t('upcomingProjects'),
    pastProjects: t('pastProjects'),
    noUpcomingProjects: t('noUpcomingProjects'),
    noPastProjects: t('noPastProjects'),
    viewAgenda: t('viewAgenda'),
    viewAgendaDescription: t('viewAgendaDescription'),
    viewProject: t('viewProject'),
  };

  return (
    <>
      <HeroImpactStatsBlock {...projectListInformation} />
      <HawkStarsSection className='bg-bege-light gap-8 pt-10 pb-8 max-lg:px-0 max-lg:pt-0 xl:px-10!'>
        {projectListInformation.video && (
          <div className='mx-auto flex justify-center'>
            <VideoBlock videoUrl={projectListInformation.video} blockType={'videoBlock'} autoplay />
          </div>
        )}
        <ProjectsList projects={projects} lng={lng} translations={translations} />
      </HawkStarsSection>
    </>
  );
};

export default EventsPage;
