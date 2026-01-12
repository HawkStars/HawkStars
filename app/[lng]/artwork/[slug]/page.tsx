import { HawkStarsSection } from '@/components/layout';

import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { getServerTranslation } from '@/i18n';
import { Button } from '@/components/ui/button';
import ArtPropertyComponent from '@/components/art/ArtProperty';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleArtwork } from '@/lib/payload/queries/artwork';
import { Curator, Media } from '@/payload-types';
import { MediaBlock } from '@/payload/blocks/MediaBlock/Component';
import RichText from '@/payload/components/RichText';
import { connection } from 'next/server';

export const revalidate = 600; // invalidate every 10 minutes

const getCuratorInformation = async (slug: string, locale: Language) => {
  const response = await getSingleArtwork(slug, locale);
  return response;
};

export async function generateMetadata(props: CuratorPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  // const artwork = await getCuratorInformation(slug, lng);

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

const CuratorPage = async (props: CuratorPageProps) => {
  await connection();
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) return notFound();

  const artwork = await getCuratorInformation(slug, lng);
  const { t } = await getServerTranslation(lng, 'art');
  if (!artwork) notFound();

  return (
    <>
      <HawkStarsSection className='bg-bege-light flex gap-8 pt-10 pb-8 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
        <div className='max-lg:mx-auto lg:w-7/12'>
          {artwork.image && (
            <MediaBlock
              media={{ image: artwork.image as Media, imageType: 'upload', alt: '' }}
              blockType='mediaBlock'
            />
          )}
        </div>
        <div className='font-oswald flex flex-col px-5 pt-5 lg:w-5/12'>
          <h2 className='text-h1_semibold text-disabled mb-2'>
            {(artwork.artist as Curator).name}
          </h2>
          <h1 className='text-h1_semibold text-disabled mb-10'>{artwork.title}</h1>

          <div className='my-5 grid grid-cols-2 gap-x-12 gap-y-8'>
            <ArtPropertyComponent label={t('artwork.year')} value={artwork.year} />
            <ArtPropertyComponent label={t('artwork.dimensions')} value={artwork.dimensions} />
            <ArtPropertyComponent label={t('artwork.settings')} value={artwork.settings} />
            <ArtPropertyComponent label={t('artwork.tiragem')} value={artwork.tiragem} />
          </div>
          {!artwork.is_sold && (
            <div className='mt-auto flex flex-col gap-3 max-md:mt-6'>
              <h2 className='text-h2_bold text-disabled my-auto'>{artwork.price}</h2>
              <a href='https://forms.gle/XA4kwkHFJvcmEduCA' target='_blank'>
                <Button type={'button'}>{t('buy')}</Button>
              </a>
              <span className='-mt-2 ml-1 opacity-90'>{t('artwork.vat_and_ports')}</span>
            </div>
          )}
          {artwork.is_sold && (
            <Button type='button' disabled variant='default'>
              {t('sold')}
            </Button>
          )}
        </div>
      </HawkStarsSection>
      <section className='font-oswald mx-auto mt-6 flex max-w-7xl flex-col gap-4 px-4 text-justify lg:px-8'>
        <h6 className='text-h2_bold'>{t('artwork.synopsis')}</h6>
        {artwork?.synopsis && <RichText data={artwork?.synopsis} />}
        {artwork.extra && (
          <div>
            <RichText data={artwork.extra} />
          </div>
        )}
      </section>
    </>
  );
};

export default CuratorPage;
