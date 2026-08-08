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

export const instant = false;

type HomeProps = {
  params: Promise<{ lng: Language }>;
};

export default async function Home(props: HomeProps) {
  const params = await props.params;
  const { lng } = params;

  return (
    <Suspense fallback={<></>}>
      <MainPageWrapper lng={lng} />
    </Suspense>
  );
}
