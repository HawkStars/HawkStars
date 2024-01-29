import PartnersComponent from '../../../components/partners/PartnersComponent';
import { Metadata, ResolvingMetadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';

export async function generateMetadata({ params }: LanguagePageProps): Promise<Metadata> {
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'partners');
  return metadataPage;
}

const PartnersPage = ({ params: { lng } }: { params: { lng: string } }) => {
  return <PartnersComponent lng={lng} />;
};

export default PartnersPage;
