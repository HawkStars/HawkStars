import Image from 'next/image';

import heroImage from '@/public/images/art_gallery/hero.png';

import { LanguagePageProps } from '../types';
import { getServerTranslation } from '@/i18n';
import CurrentArtwork from '@/components/art/CurrentArtwork';
import Curators from '@/components/art/Curators';

const GalleryPage = async (props: LanguagePageProps) => {
  const params = await props.params;
  const { lng } = params;

  const { t } = await getServerTranslation(lng, 'art');
  return (
    <>
      <section className='bg-bege-light lg:pt-14 lg:pb-14 pb-4'>
        <div className='mx-auto flex max-w-6xl gap-6 max-lg:flex-col-reverse lg:justify-center'>
          <div className='flex flex-col gap-2 lg:w-1/2 font-body font-light max-lg:px-4 lg:pl-4'>
            <h1 className='lg:text-h1_semibold text-h2_bold'>{t('art_gallery')}</h1>
            <h2 className='lg:text-h1_semibold text-h2_bold font-medium mb-4'>{t("social_impact")}</h2>
            <p className='lg:text-h2_light text-body_regular text-justify'>{t('subtitle')}</p>
          </div>
          <div className='lg:w-1/2'>
            <Image
              className='ml-auto max-w-full object-cover'
              style={{ height: "100%"}}
              src={heroImage}
              alt=""
            />
          </div>
        </div>
      </section>
      <section className='mt-8 max-w-6xl lg:mx-auto text-center lg:w-7/12 w-11/12 lg:text-h2_light text-body_regular max-lg:mx-4 max-lg:text-left'>
        <p>{t('description_1')}</p>
        <p>{t('description_2')}</p>
      </section>
      <CurrentArtwork lng={lng} />
      <Curators lng={lng} />
    </>
  );
};

export default GalleryPage;


