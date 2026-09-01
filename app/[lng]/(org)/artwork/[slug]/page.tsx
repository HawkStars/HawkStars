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
import { ImageMedia } from '@/payload/components/Media';
import RichText from '@/payload/components/RichText';
import Link from 'next/link';
import { Suspense } from 'react';
// import { cacheLife, cacheTag } from 'next/cache';
// import { ART_COLLECTION_CACHE_TAG } from '@/payload/collections/ArtCollection';

// The `'use cache'` here was untagged, so nothing could invalidate it: editors
// saving an artwork fired ArtCollection's revalidate hook (ART_COLLECTION_CACHE_TAG)
// but this entry carried no tag to match, leaving the page stale until the default
// cache life expired. Tagged the same way the curator route tags its lookup.
const getArtworkInformation = async (slug: string, locale: Language) => {
  // 'use cache';
  // cacheLife('hours');
  // cacheTag(`${ART_COLLECTION_CACHE_TAG}:${slug}`, ART_COLLECTION_CACHE_TAG);
  return getSingleArtwork(slug, locale);
};

export async function generateMetadata(props: CuratorPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  // const artwork = await getArtworkInformation(slug, lng);

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

const CuratorPage = (props: CuratorPageProps) => (
  <Suspense fallback={<></>}>
    <ArtworkContent params={props.params} />
  </Suspense>
);

const ArtworkContent = async ({ params }: { params: CuratorPageProps['params'] }) => {
  const { lng, slug } = await params;
  if (!slug) return notFound();

  const artwork = await getArtworkInformation(slug, lng);
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
          <p className='text-h1_semibold text-disabled mb-2'>{(artwork.artist as Curator).name}</p>
          <h1 className='text-h1_semibold text-disabled mb-10'>{artwork.title}</h1>

          <div className='my-5 grid grid-cols-2 gap-x-12 gap-y-8'>
            <ArtPropertyComponent label={t('artwork.year')} value={artwork.year} />
            <ArtPropertyComponent label={t('artwork.dimensions')} value={artwork.dimensions} />
            <ArtPropertyComponent label={t('artwork.settings')} value={artwork.settings} />
            <ArtPropertyComponent label={t('artwork.tiragem')} value={artwork.tiragem} />
          </div>
          {!artwork.is_sold && (
            <div className='mt-5 flex flex-col gap-3 max-md:mt-6'>
              <p className='text-h2_bold text-disabled my-auto'>{artwork.price}</p>
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
      <section className='font-oswald mx-auto mt-6 flex flex-col gap-4 px-4 text-justify lg:px-8 xl:px-40'>
        <h2 className='text-h2_bold max-lg:px-1'>{t('artwork.synopsis')}</h2>
        {artwork?.synopsis && <RichText data={artwork?.synopsis} />}
        {artwork.extra && (
          <div>
            <RichText data={artwork.extra} />
          </div>
        )}
      </section>
      {artwork.artist && typeof artwork.artist !== 'string' && (
        <section className='bg-bege-light mt-10 py-10'>
          <div className='font-oswald mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center lg:flex-row lg:items-start lg:px-8 lg:text-left xl:px-40'>
            {artwork.artist.image && (
              <div className='w-40 shrink-0 lg:w-48'>
                <ImageMedia
                  resource={artwork.artist.image}
                  alt={artwork.artist.name}
                  width={192}
                  height={192}
                  className='aspect-square rounded-lg object-cover'
                />
              </div>
            )}
            <div className='flex flex-1 flex-col items-center gap-2 lg:items-start'>
              <h2 className='text-h2_bold'>{t('curator_section.title')}</h2>
              <p className='text-h2_light text-body_regular'>{artwork.artist.name}</p>
              {artwork.artist.description && (
                <div className='text-justify'>
                  <RichText data={artwork.artist.description} />
                </div>
              )}
              <Link href={`/${lng}/curator/${artwork.artist.slug}`} className='mt-2'>
                <Button variant='outline' type='button'>
                  {t('curator_section.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CuratorPage;
