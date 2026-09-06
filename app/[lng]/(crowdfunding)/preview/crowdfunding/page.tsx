'use server';
import { Metadata } from 'next';
import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { connection } from 'next/server';
import { getCrowdfundingSettings } from '@/lib/payload/queries/globals/crowdfundingSettings';
import { LivePreviewCrowdfundingPage } from '@/payload/components/LivePreview/globals/LivePreviewCrowdfundingPage';
import { getPayloadConfig } from '@/lib/payload/server';
import { headers as getHeaders } from 'next/headers';

type PageProps = {
  params: Promise<LanguageProps & { slug: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return { robots: 'noindex, nofollow' };
}

const Index = async (props: PageProps) => {
  await connection();
  const params = await props.params;
  const { lng } = params;

  const headers = await getHeaders();
  const payload = await getPayloadConfig();
  const { user } = await payload.auth({ headers });
  if (!user) return notFound();

  const settings = await getCrowdfundingSettings(lng, true);
  if (!settings) notFound();

  return (
    <LivePreviewCrowdfundingPage initialData={settings} serverURL={getServerSideURL()} lng={lng} />
  );
};

export default Index;
