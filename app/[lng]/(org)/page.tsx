import { Metadata } from 'next';
import { getMetadataPageInfo, prepareMetadataInfo } from '@/utils/metadata';
import { LanguagePageProps } from './types';
import { Language } from '@/i18n/settings';
import { getMainPageInformation } from '@/lib/payload/main-page';
import MainPageWrapper from '@/components/main-page/MainPageWrapper';
import { connection } from 'next/server';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const pageInformation = await getMainPageInformation(lng as Language);
  if (pageInformation && pageInformation.meta)
    return prepareMetadataInfo({
      ...pageInformation.meta,
      image: pageInformation.meta.image,
      url: '/',
      lng: lng as Language,
    });

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type HomeProps = {
  params: Promise<{ lng: Language }>;
};

export default async function Home(props: HomeProps) {
  await connection();
  return <HomeContent params={props.params} />;
}

async function HomeContent({ params }: { params: Promise<{ lng: Language }> }) {
  const { lng } = await params;

  return <MainPageWrapper lng={lng} />;
}
