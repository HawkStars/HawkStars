import { Metadata, ResolvingMetadata } from 'next';
import AboutPage from '../../../components/about/AboutPage';
import { getMetadataPageInfo } from '@/utils/metadata';
import { LanguagePageProps } from '../types';

export async function generateMetadata({
  params,
}: LanguagePageProps): Promise<Metadata> {
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng, 'about');
  return metadataPage;
}

const Index = async ({ params: { lng } }: { params: { lng: string } }) => {
  return <AboutPage lng={lng} />;
};

export default Index;
