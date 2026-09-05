import { Metadata } from 'next';
import { Language } from '@/i18n/settings';

import { getMainPageInformationPreview } from '@/lib/payload/main-page';
import { connection } from 'next/server';
import { LivePreviewPage } from '@/payload/components/LivePreview/LivePreviewPage';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { getPayloadConfig } from '@/lib/payload/server';
import { headers as getHeaders } from 'next/headers';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return { robots: 'noindex, nofollow' };
}

type HomeProps = {
  params: Promise<{ lng: Language }>;
};

export default async function Home(props: HomeProps) {
  await connection();
  const params = await props.params;
  const { lng } = params;

  const headers = await getHeaders();
  const payload = await getPayloadConfig();
  const { user } = await payload.auth({ headers });
  if (!user) return notFound();

  const pageInformation = await getMainPageInformationPreview(lng as Language);

  if (pageInformation === null) return null;
  return <LivePreviewPage initialData={pageInformation} serverURL={getServerSideURL()} />;
}
