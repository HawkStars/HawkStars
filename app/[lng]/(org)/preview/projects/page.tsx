import { Metadata } from 'next';
import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { connection } from 'next/server';
import { LivePreviewProject } from '@/payload/components/LivePreview/LivePreviewProject';
import { getSingleEventsQuery } from '@/lib/payload/queries/event';

type PageProps = {
  params: Promise<LanguageProps & { slug: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return { robots: 'noindex, nofollow' };
}

const SingleProjectPreview = async (props: PageProps) => {
  await connection();
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) notFound();
  const project = await getSingleEventsQuery(slug, lng, { preview: true });
  if (!project) notFound();

  return <LivePreviewProject initialData={project} serverURL={getServerSideURL()} />;
};

export default SingleProjectPreview;
