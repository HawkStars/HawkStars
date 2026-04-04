import { Metadata } from 'next';
import { Language } from '@/i18n/settings';

import { connection } from 'next/server';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { getNewsListHeader } from '@/lib/payload/queries/globals/newsList';
import { getNewsQuery } from '@/lib/payload/queries/news';
import { LivePreviewNewsList } from '@/payload/components/LivePreview/globals/LivePreviewNewsList';

export async function generateMetadata(): Promise<Metadata> {
  return { robots: 'noindex, nofollow' };
}

type HomeProps = {
  params: Promise<{ lng: Language }>;
};

export default async function PreviewNewsList(props: HomeProps) {
  await connection();
  const params = await props.params;
  const { lng } = params;
  const page = 1;

  const [newsListHeader, news] = await Promise.all([
    getNewsListHeader(lng as Language, true),
    getNewsQuery(page, lng as Language),
  ]);

  return (
    <LivePreviewNewsList
      initialData={{ newsListHeader, news }}
      serverURL={getServerSideURL()}
      lng={lng}
    />
  );
}
