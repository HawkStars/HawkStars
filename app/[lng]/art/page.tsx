import Image from 'next/image';

import heroImage from '@/public/images/art_gallery/hero.png';

import { LanguagePageProps } from '../types';
import { getServerTranslation } from '@/i18n';

const GalleryPage = async (props: LanguagePageProps) => {
  const params = await props.params;
  const { lng } = params;

  const { t } = await getServerTranslation(lng, 'art');
  return (
    <>
      <section className='mx-auto flex max-w-6xl gap-4 max-lg:flex-col-reverse lg:mt-14 lg:justify-center'>
        <div className='flex flex-col gap-8 lg:w-1/2 font-body font-light'>
          <h1 className='lg:text-h1_semibold text-h2_bold'>{t('title')}</h1>
          <h2 className='lg:text-h2_light text-body_regular'>{t('subtitle')}</h2>
        </div>
        <div className='lg:w-1/2'>
          <Image
            className='ml-auto max-w-full object-cover'
            style={{ height: "100%"}}
            src={heroImage}
            alt=""
          />
        </div>
      </section>
      <section className='mt-8 max-w-6xl lg:mx-auto text-center w-7/12 font-body font-light'>
        <p>{t('description_1')}</p>
        <p>{t('description_2')}</p>
      </section>
    </>
  );
};

export default GalleryPage;


