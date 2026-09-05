import { Metadata } from 'next';
import { getSingleNewsSlug } from '@/lib/payload/queries/news';
import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { LivePreviewNews } from '@/payload/components/LivePreview/LivePreviewNews';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { connection } from 'next/server';
import { headers as getHeaders } from 'next/headers';
import { getPayloadConfig } from '@/lib/payload/server';

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

  const headers = await getHeaders();
  const payload = await getPayloadConfig();
  const { user } = await payload.auth({ headers });
  if (!user) return notFound();

  const newsArticle = await getSingleNewsSlug(slug, lng, { preview: true });
  if (!newsArticle) notFound();

  return <LivePreviewNews initialData={{ ...newsArticle, lng }} serverURL={getServerSideURL()} />;
};

export default NewsPreview;
