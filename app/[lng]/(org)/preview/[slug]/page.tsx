import { Metadata } from 'next';
import { getSinglePageSlug } from '@/lib/payload/queries/page';
import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { LivePreviewPage } from '@/payload/components/LivePreview/LivePreviewPage';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { connection } from 'next/server';

type PageProps = {
  params: Promise<LanguageProps & { slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  return { robots: 'noindex, nofollow' };
}

const Index = async (props: PageProps) => {
  await connection();
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) notFound();
  const pageInformation = await getSinglePageSlug(slug, lng, { preview: true });
  if (!pageInformation) notFound();

  return <LivePreviewPage initialData={pageInformation} serverURL={getServerSideURL()} />;
};

export default Index;
