import HomeComponent from '../../components/home/HomeComponent';
import { Metadata } from 'next';
import { getMetadataPageInfo } from '@/utils/metadata';
import { LanguagePageProps } from './types';
import { Language } from '@/i18n/settings';

export async function generateMetadata({ params }: LanguagePageProps): Promise<Metadata> {
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type HomeProps = {
  params: { lng: string };
};

export default function Home({ params: { lng } }: HomeProps) {
  return <HomeComponent lng={lng} />;
}
