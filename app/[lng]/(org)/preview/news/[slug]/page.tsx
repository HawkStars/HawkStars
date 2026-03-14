import { Metadata } from 'next';
import { getSingleNewsSlug } from '@/lib/payload/queries/news';
import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { LivePreviewNews } from '@/payload/components/LivePreview/LivePreviewNews';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { connection } from 'next/server';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<LanguageProps & { slug: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return { robots: 'noindex, nofollow' };
}

const NewsPreview = async (props: PageProps) => {
  await connection();
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) notFound();
  const newsArticle = await getSingleNewsSlug(slug, lng, { preview: true });
  if (!newsArticle) notFound();

  return <LivePreviewNews initialData={newsArticle} serverURL={getServerSideURL()} />;
};

export default NewsPreview;
