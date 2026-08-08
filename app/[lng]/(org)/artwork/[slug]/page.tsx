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
import { Suspense } from 'react';

const getCuratorInformation = async (slug: string, locale: Language) => {
  'use cache';
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

// Not `async` — opens the <Suspense> boundary before any data is requested.
// `'use cache'` above makes the artwork query prerenderable, but `params` is
// still a dynamic API on this route ([slug] has no generateStaticParams), so
// awaiting it in the page body would keep the route blocking regardless. The
// promise is consumed by a child inside the boundary instead.
const CuratorPage = (props: CuratorPageProps) => (
  <Suspense fallback={<></>}>
    <ArtworkContent params={props.params} />
  </Suspense>
);

const ArtworkContent = async ({ params }: { params: CuratorPageProps['params'] }) => {
  const { lng, slug } = await params;
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
    </>
  );
};

export default CuratorPage;
