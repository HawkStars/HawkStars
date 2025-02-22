import Image from 'next/image';

import heroImage from '@/public/images/art_gallery/hero.png';

import { LanguagePageProps } from '../types';
import { getServerTranslation } from '@/i18n';
import Curators from '@/components/art/Curators';

const GalleryPage = async (props: LanguagePageProps) => {
  const params = await props.params;
  const { lng } = params;

  const { t } = await getServerTranslation(lng, 'art');
  return (
    <>
      <section className='bg-bege-light pb-4 lg:pb-14 lg:pt-14'>
        <div className='mx-auto flex max-w-7xl gap-12 max-lg:flex-col-reverse lg:justify-center'>
          <div className='font-body font-oswald flex flex-col gap-2 font-light max-lg:px-4 lg:w-1/2 lg:pl-4'>
            <h1 className='lg:text-h1_semibold text-h2_bold'>{t('art_gallery')}</h1>
            <h2 className='lg:text-h1_semibold text-h2_bold mb-4 font-medium'>
              {t('social_impact')}
            </h2>
            <p className='lg:text-h2_light text-body_regular text-justify'>{t('subtitle')}</p>
          </div>
          <div className='lg:w-1/2'>
            <Image
              className='ml-auto max-w-full object-cover'
              style={{ height: '100%' }}
              src={heroImage}
              alt=''
            />
          </div>
        </div>
      </section>
      <section className='lg:text-h2_light text-body_regular font-oswald mt-8 max-w-6xl max-lg:mx-4 max-lg:text-left lg:mx-auto lg:w-7/12'>
        <p className='text-justify'>{t('description_1')}</p>
        <p className='text-justify'>{t('description_2')}</p>
      </section>
      <Curators lng={lng} />
    </>
  );
};

export default GalleryPage;
