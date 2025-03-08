import Image from 'next/image';

import whoWeAreImage from '@/public/images/frontpage/quem_somos.png';
import { getServerTranslation } from '@/i18n';

const HomeObjectivesSection = async ({ lng }: { lng: string }) => {
  const { t } = await getServerTranslation(lng, 'common');
  return (
    <section className='mx-auto mt-5 flex max-w-6xl flex-col gap-10 px-8 pb-10 lg:mt-20 lg:flex-row-reverse lg:px-14 lg:pl-20 xl:pl-0'>
      <div className='flex flex-col gap-2 lg:w-1/2'>
        <h2 className='text-h2_bold text-green'>{t('home.about')}</h2>
        <h6 className='text-h2_light'>{t('home.objetives_title')}</h6>
        <p className='text-body_regular lg:text-justify'>{t('home.objetives_body')}</p>
      </div>
      <div className='relative h-96 w-full lg:w-1/2'>
        <Image
          src={whoWeAreImage}
          alt='quem_somos'
          fill={true}
          style={{ objectFit: 'cover' }}
          loading='lazy'
          sizes='100vw lg:50vw'
        />
      </div>
    </section>
  );
};

export default HomeObjectivesSection;
