import { Metadata } from 'next';
import { getMetadataPageInfo } from '@/utils/metadata';
import { LanguagePageProps } from './types';
import { Language } from '@/i18n/settings';
import ErasmusSlider from '@/components/home/ErasmusSlider';
import GlobalVillageSection from '@/components/home/GlobalVillage';
import HomeHeroSection from '@/components/home/HomeHeroSection';
import HomeObjectivesSection from '@/components/home/HomeObjectivesSection';
import VisionSection from '@/components/home/VisionSection';

export const revalidate = 7200; // 2 hours

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type HomeProps = {
  params: Promise<{ lng: Language }>;
};

export default async function Home(props: HomeProps) {
  const params = await props.params;

  const { lng } = params;

  return (
    <>
      <HomeHeroSection />
      <HomeObjectivesSection lng={lng} />
      <VisionSection lng={lng} />
      <GlobalVillageSection lng={lng} />
      <ErasmusSlider />
    </>
  );
}
