import PartnersComponent from '../../../components/partners/PartnersComponent';
import { Metadata, ResolvingMetadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'partners');
  return metadataPage;
}

const PartnersPage = async (props: { params: Promise<{ lng: string }> }) => {
  const params = await props.params;

  const {
    lng
  } = params;

  return <PartnersComponent lng={lng} />;
};

export default PartnersPage;
