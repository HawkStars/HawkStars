import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import PartnersWrapper from '@/components/partners/PartnersWrapper';
import { Suspense } from 'react';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'partners');
  return metadataPage;
}

const PartnersPage = async (props: { params: Promise<{ lng: Language }> }) => {
  const params = await props.params;
  const { lng } = params;

  return (
    <section>
      <Suspense fallback={<></>}>
        <PartnersWrapper lng={lng} />
      </Suspense>
    </section>
  );
};

export default PartnersPage;
