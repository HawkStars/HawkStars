'use client';

import Button from '@/components/utils/Button';
import { urls } from '@/utils/paths';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// image
import exterior1 from '@/public/images/training_center/exterior1.jpg';
import { useTranslation } from '@/i18n/client';

const GlobalVillageSection = ({ lng }: { lng: string }) => {
  const router = useRouter();
  const { t } = useTranslation(lng, 'common');

  return (
    <section className='bg-bege-dark px-8 py-20 lg:px-20'>
      <div className='mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row lg:gap-20'>
        <Image
          src={exterior1}
          alt='Global Village'
          className='flex-1 rounded-lg lg:w-1/2'
          sizes='100vw lg:50vw'
        />
        <div className='flex flex-1 flex-col gap-4 lg:w-1/2'>
          <h3 className='lg:text-h1_semibold text-h2_bold mt-5 text-green'>Global Village</h3>
          <p className='lg:text-h2_light text-body_regular'>{t('home.global_village')}</p>
          <div>
            <Button type={'button'} onClick={() => router.push(urls.global_village)}>
              {t('see_more')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalVillageSection;
