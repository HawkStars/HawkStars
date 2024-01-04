import HomeComponent from '../../components/home/HomeComponent';
import { Metadata } from 'next';
import { getMetadataPageInfo } from '@/utils/metadata';
import { LanguagePageProps } from './types';

export async function generateMetadata({
  params,
}: LanguagePageProps): Promise<Metadata> {
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng, 'home');
  return metadataPage;
}

type HomeProps = {
  params: { lng: string };
};

export default function Home({ params: { lng } }: HomeProps) {
  return <HomeComponent />;
}
