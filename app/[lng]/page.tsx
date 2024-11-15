import HomeComponent from '../../components/home/HomeComponent';
import { Metadata } from 'next';
import { getMetadataPageInfo } from '@/utils/metadata';
import { LanguagePageProps } from './types';
import { Language } from '@/i18n/settings';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type HomeProps = {
  params: Promise<{ lng: string }>;
};

export default async function Home(props: HomeProps) {
  const params = await props.params;

  const {
    lng
  } = params;

  return <HomeComponent lng={lng} />;
}
