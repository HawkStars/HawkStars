import { Metadata } from 'next';
import { Language } from '@/i18n/settings';

import { getMainPageInformation } from '@/lib/payload/main-page';
import RichText from '@/payload/components/RichText';
import { connection } from 'next/server';

export const revalidate = 600; // invalidate every 10 minutes

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
  const pageInformation = await getMainPageInformation(lng as Language, { preview: true });

  if (pageInformation === null) return null;
  return <RichText data={pageInformation.layout} />;
}
