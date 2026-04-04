import { Metadata } from 'next';
import { Language } from '@/i18n/settings';

import { connection } from 'next/server';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { getProjectsListHeaderInfo } from '@/lib/payload/queries/globals/projectsList';
import { getProjectsSplitByDate } from '@/lib/payload/queries/event';
import { getServerTranslation } from '@/i18n';
import { LivePreviewProjectList } from '@/payload/components/LivePreview/globals/LivePreviewProjectList';

export async function generateMetadata(): Promise<Metadata> {
  return { robots: 'noindex, nofollow' };
}

type HomeProps = {
  params: Promise<{ lng: Language }>;
};

export default async function PreviewProjectsList(props: HomeProps) {
  await connection();
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
    <LivePreviewProjectList
      initialData={{ projectListInformation, projects, translations }}
      serverURL={getServerSideURL()}
      lng={lng}
    />
  );
}
