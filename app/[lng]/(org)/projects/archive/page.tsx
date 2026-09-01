import ArchiveListComponent from '@/components/shared/ArchiveListComponent';
import ProjectCard from '@/components/projects/list/ProjectCard';
import { PROJECT_TYPES } from '@/components/projects/constants';
import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getPastProjectsQuery, getProjectYearsQuery } from '@/lib/payload/queries/projects';
import { HawkProject } from '@/payload-types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { SITE_GET_URLS } from '@/utils/paths';
import { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateMetadata(props: ProjectsArchivePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;

  const metadataPage = getMetadataPageInfo(lng as Language, 'projects_archive');
  return metadataPage;
}

type ProjectsArchivePageProps = {
  params: Promise<LanguageProps>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

// Same shape as app/[lng]/(org)/projects/page.tsx: a non-async page component
// that only opens the <Suspense> boundary, with `params`/`searchParams`
// consumed inside it so the pagination query params stay per-request.
const ProjectsArchivePage = (props: ProjectsArchivePageProps) => (
  <Suspense fallback={<></>}>
    <ProjectsArchiveContent params={props.params} searchParams={props.searchParams} />
  </Suspense>
);

const ProjectsArchiveContent = async ({
  params,
  searchParams,
}: {
  params: ProjectsArchivePageProps['params'];
  searchParams: ProjectsArchivePageProps['searchParams'];
}) => {
  const [{ lng }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
  const limit = resolvedSearchParams.limit ? Number(resolvedSearchParams.limit) : undefined;
  const type =
    typeof resolvedSearchParams.type === 'string'
      ? (resolvedSearchParams.type as HawkProject['project_type'])
      : undefined;
  const year = resolvedSearchParams.year ? Number(resolvedSearchParams.year) : undefined;

  const [pastProjects, years, { t }, { t: commonT }] = await Promise.all([
    getPastProjectsQuery(lng as Language, { page, limit, type, year }),
    getProjectYearsQuery(lng as Language),
    getServerTranslation(lng, 'projects'),
    getServerTranslation(lng, 'common'),
  ]);

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

  return (
    <ArchiveListComponent
      items={pastProjects}
      lng={lng}
      title={t('pastProjects')}
      emptyLabel={t('noPastProjects')}
      t={commonT}
      url={SITE_GET_URLS.projects_archive}
      filters={filters}
      renderCard={(project, idx) => (
        <ProjectCard key={project.id} project={project} index={idx} lng={lng} />
      )}
    />
  );
};

export default ProjectsArchivePage;
