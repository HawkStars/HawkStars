import { Metadata } from 'next';
import AboutPage from '../../../components/utils/about/AboutPage';
import { getMetadataPageInfo } from '@/utils/metadata';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';

export async function generateMetadata({ params }: LanguagePageProps): Promise<Metadata> {
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'about');
  return metadataPage;
}

const Index = async ({ params: { lng } }: { params: { lng: string } }) => {
  return <AboutPage lng={lng} />;
};

export default Index;
