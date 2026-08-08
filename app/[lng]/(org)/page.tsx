import { Metadata } from 'next';
import { getMetadataPageInfo, prepareMetadataInfo } from '@/utils/metadata';
import { LanguagePageProps } from './types';
import { Language } from '@/i18n/settings';
import { getMainPageInformation } from '@/lib/payload/main-page';
import { Suspense } from 'react';
import MainPageWrapper from '@/components/main-page/MainPageWrapper';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const pageInformation = await getMainPageInformation(lng as Language);
  if (pageInformation && pageInformation.meta) return prepareMetadataInfo(pageInformation.meta);

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type HomeProps = {
  params: Promise<{ lng: Language }>;
};

export default function Home(props: HomeProps) {
  return (
    <Suspense fallback={<></>}>
      <HomeContent params={props.params} />
    </Suspense>
  );
}

async function HomeContent({ params }: { params: Promise<{ lng: Language }> }) {
  const { lng } = await params;

  return <MainPageWrapper lng={lng} />;
}
