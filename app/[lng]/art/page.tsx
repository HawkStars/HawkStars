import Image from 'next/image';

import heroImage from '@/public/images/art_gallery/hero.jpg';

import { LanguagePageProps } from '../types';
import { getServerTranslation } from '@/i18n';

const GalleryPage = async (props: LanguagePageProps) => {
  const params = await props.params;
  const { lng } = params;

  const { t } = await getServerTranslation(lng, 'art');
  return (
    <>
      <section className='mx-auto flex max-w-6xl gap-4 max-lg:flex-col-reverse lg:mt-14 lg:justify-center'>
        <div className='flex flex-col justify-around gap-8 lg:w-1/2'>
          <h1>{t('title')}</h1>
          <h2>{t('subtitle')}</h2>
        </div>
        <div className='lg:w-1/2'>
          <Image
            className='ml-auto max-w-full object-contain lg:max-w-96'
            src={heroImage}
            alt='https://unsplash.com/photos/brown-wooden-framed-wall-mounted-mirror-SjEO_MEM_NI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'
          />
          <div className='text-gray-light flex justify-end gap-1 text-xs'>
            <a href='https://unsplash.com/@cloudett?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'>
              Laura Cleffmann
            </a>
            {` on `}
            <a href='https://unsplash.com/photos/brown-wooden-framed-wall-mounted-mirror-SjEO_MEM_NI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'>
              Unsplash
            </a>
          </div>
        </div>
      </section>
      <section className='mt-8 flex max-w-6xl flex-col gap-2 text-justify lg:mx-auto'>
        <p>{t('description_1')}</p>
        <p>{t('description_2')}</p>
      </section>
    </>
  );
};

export default GalleryPage;
