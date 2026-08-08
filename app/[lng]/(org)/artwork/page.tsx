import { LanguagePageProps } from '../types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { Metadata } from 'next';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Suspense } from 'react';
import { ArtworkWrapper } from '@/components/art/artwork/ArtWrapper';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'artwork');
  return metadataPage;
}

const ArtworkPage = async (props: LanguagePageProps) => {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getServerTranslation(lng, 'art');

  return (
    <section className='mt-5 flex flex-col gap-4 lg:mt-10'>
      <h1 className='text-h1_semibold font-oswald text-green text-center'>{t('artwork.pieces')}</h1>
      <Suspense fallback={<></>}>
        <ArtworkWrapper locale={lng} />
      </Suspense>
    </section>
  );
};

export default ArtworkPage;
