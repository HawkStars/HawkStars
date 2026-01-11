import PartnersComponent from '../../../components/partners/PartnersComponent';
import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import { getPartnersQuery } from '@/lib/payload/queries/partner';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'partners');
  return metadataPage;
}

const PartnersPage = async (props: { params: Promise<{ lng: Language }> }) => {
  const params = await props.params;
  const { lng } = params;
  const data = await getPartnersQuery();
  const { docs: partners, totalDocs } = data;

  if (!totalDocs) return <div>No partners found.</div>;
  return <PartnersComponent lng={lng} partners={partners} />;
};

export default PartnersPage;
