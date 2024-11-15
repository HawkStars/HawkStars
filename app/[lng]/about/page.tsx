import { Metadata } from 'next';
import AboutPage from '../../../components/utils/about/AboutPage';
import { getMetadataPageInfo } from '@/utils/metadata';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'about');
  return metadataPage;
}

const Index = async (props: { params: Promise<{ lng: string }> }) => {
  const params = await props.params;

  const {
    lng
  } = params;

  return <AboutPage lng={lng} />;
};

export default Index;
