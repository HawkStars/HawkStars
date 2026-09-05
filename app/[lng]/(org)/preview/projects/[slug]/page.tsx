import { Metadata } from 'next';
import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { connection } from 'next/server';
import { LivePreviewProject } from '@/payload/components/LivePreview/LivePreviewProject';
import { getSingleProjectsQuery } from '@/lib/payload/queries/projects';
import { headers as getHeaders } from 'next/headers';
import { getPayloadConfig } from '@/lib/payload/server';

type PageProps = {
  params: Promise<LanguageProps & { slug: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return { robots: 'noindex, nofollow' };
}

const SingleProjectPreview = async (props: PageProps) => {
  await connection();
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) notFound();

  const headers = await getHeaders();
  const payload = await getPayloadConfig();
  const { user } = await payload.auth({ headers });
  if (!user) return notFound();

  const project = await getSingleProjectsQuery(slug, lng, { preview: true });
  if (!project) notFound();

  return <LivePreviewProject initialData={project} serverURL={getServerSideURL()} />;
};

export default SingleProjectPreview;
