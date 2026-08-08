import { ImageMedia } from '@/payload/components/Media';

import heroImage from '@/public/images/art_gallery/hero.png';

import { LanguagePageProps } from '../types';
import { getServerTranslation } from '@/i18n';
import Curators from '@/components/art/Curators';
import { Metadata } from 'next';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import Link from 'next/link';
import { Suspense } from 'react';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'gallery');
  return metadataPage;
}

const GalleryPage = async (props: LanguagePageProps) => {
  const { lng } = await props.params;
  return <GalleryContent lng={lng} />;
};

// The hero and copy depend only on `lng`, so they are cached here rather than
// left as an uncached `getServerTranslation` (a dynamic `import()` of the locale
// JSON, which under `cacheComponents` makes the whole route blocking). <Curators>
// hits Payload, so it gets its own boundary below and streams independently —
// otherwise the whole page would wait on that query before showing anything.
async function GalleryContent({ lng }: { lng: string }) {
  'use cache';
  const { t } = await getServerTranslation(lng as Language, 'art');
  return (
    <>
      <section className='bg-bege-light pb-4 lg:pt-14 lg:pb-14'>
        <div className='mx-auto flex max-w-7xl gap-12 max-lg:flex-col-reverse lg:justify-center'>
          <div className='font-body font-oswald flex flex-col gap-2 max-lg:px-4 lg:w-1/2 lg:pl-4'>
            <h1 className='lg:text-h1_semibold text-h2_bold'>{t('art_gallery')}</h1>
            <h2 className='lg:text-h1_semibold text-h2_bold mb-4'>{t('social_impact')}</h2>
            <p className='lg:text-h2_light text-body_regular text-justify'>{t('subtitle')}</p>
          </div>
          <div className='lg:w-1/2'>
            <Link href={`/${lng}/artwork`} className='cursor-pointer'>
              <ImageMedia
                className='ml-auto h-full max-w-full object-cover'
                src={heroImage}
                alt=''
              />
            </Link>
          </div>
        </div>
      </section>
      <section className='lg:text-h2_light text-body_regular font-oswald mt-8 max-w-6xl max-lg:mx-4 max-lg:text-left lg:mx-auto lg:w-7/12'>
        <p className='text-justify'>{t('description_1')}</p>
        <p className='text-justify'>{t('description_2')}</p>
      </section>
      <Suspense fallback={<></>}>
        <Curators lng={lng as Language} />
      </Suspense>
    </>
  );
}

export default GalleryPage;
