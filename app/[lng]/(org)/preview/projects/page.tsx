import { Metadata } from 'next';
import { Language } from '@/i18n/settings';
import { connection } from 'next/server';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { getProjectsListHeaderInfo } from '@/lib/payload/queries/globals/projectsList';
import { getServerTranslation } from '@/i18n';
import { LivePreviewProjectList } from '@/payload/components/LivePreview/globals/LivePreviewProjectList';
import { getProjectsSplitByDate } from '@/lib/payload/queries/projects';
import { headers as getHeaders } from 'next/headers';
import { getPayloadConfig } from '@/lib/payload/server';
import { notFound } from 'next/navigation';

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

  const headers = await getHeaders();
  const payload = await getPayloadConfig();
  const { user } = await payload.auth({ headers });
  if (!user) return notFound();

  const [projectListInformation, projects, { t }] = await Promise.all([
    getProjectsListHeaderInfo(lng),
    getProjectsSplitByDate(lng as Language),
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

  if (!projectListInformation) return null;

  return (
    <LivePreviewProjectList
      initialData={{ projectListInformation, projects, translations }}
      serverURL={getServerSideURL()}
      lng={lng}
    />
  );
}
