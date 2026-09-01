import HeroImpactStatsBlock from '@/components/projects/list/HeroImpactStatsBlock';
import SplitListComponent from '@/components/shared/SplitListComponent';
import ProjectCard from '@/components/projects/list/ProjectCard';
import { PROJECT_TYPES } from '@/components/projects/constants';
import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getProjectsListHeaderInfo } from '@/lib/payload/queries/globals/projectsList';
import { getProjectsSplitByDate, getProjectYearsQuery } from '@/lib/payload/queries/projects';
import { HawkProject } from '@/payload-types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { SITE_GET_URLS } from '@/utils/paths';
import { Metadata } from 'next';
import { Suspense } from 'react';

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
    <ProjectsContent params={props.params} searchParams={props.searchParams} />
  </Suspense>
);

const ProjectsContent = async ({
  params,
  searchParams,
}: {
  params: EventsPageProps['params'];
  searchParams: EventsPageProps['searchParams'];
}) => {
  const [{ lng }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const type =
    typeof resolvedSearchParams.type === 'string'
      ? (resolvedSearchParams.type as HawkProject['project_type'])
      : undefined;
  const year = resolvedSearchParams.year ? Number(resolvedSearchParams.year) : undefined;

  const [projectListInformation, projects, years, { t }] = await Promise.all([
    getProjectsListHeaderInfo(lng),
    getProjectsSplitByDate(lng as Language, { type, year }),
    getProjectYearsQuery(lng as Language),
    getServerTranslation(lng, 'projects'),
  ]);

  const translations = {
    upcoming: t('upcomingProjects'),
    noUpcoming: t('noUpcomingProjects'),
    viewAgenda: t('viewAgenda'),
    viewAgendaDescription: t('viewAgendaDescription'),
    viewArchive: t('viewPastProjects'),
    viewArchiveDescription: t('viewPastProjectsDescription'),
  };

  const filters = [
    {
      param: 'type',
      allLabel: t('allTypes'),
      value: type,
      options: PROJECT_TYPES.map((value) => ({ value, label: t(`types.${value}`) })),
    },
    {
      param: 'year',
      allLabel: t('allYears'),
      value: year ? String(year) : undefined,
      options: years.map((y) => ({ value: String(y), label: String(y) })),
    },
  ];

  if (!projectListInformation) return null;

  return (
    <>
      <HeroImpactStatsBlock
        {...projectListInformation}
        viewAgenda={translations.viewAgenda}
        archiveUrl={SITE_GET_URLS.projects_archive}
        viewArchive={translations.viewArchive}
      />
      <SplitListComponent
        items={projects}
        lng={lng}
        translations={translations}
        filters={filters}
        renderCard={(project, idx) => (
          <ProjectCard key={project.id} project={project} index={idx} lng={lng} />
        )}
      />
    </>
  );
};

export default EventsPage;
