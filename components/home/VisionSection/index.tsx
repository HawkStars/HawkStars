import { getServerTranslation } from '@/i18n';
import Image from 'next/image';
import { visionIcons, VisionType } from '../config';

const VisionSection = async ({ lng }: { lng: string }) => {
  const { t } = await getServerTranslation(lng, 'common');
  return (
    <section className='px-2 py-10'>
      <h4 className='lg:text-h1_semibold text-h2_bold flex justify-center text-green'>
        {t('home.values_title')}
      </h4>
      <p className='lg:text-h2_light text-body_regular flex justify-center text-center'>
        {t('home.values_body')}
      </p>
      <div className='mx-auto mt-10 grid w-2/3 grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-3'>
        {visionIcons.map((option: VisionType, index: number) => (
          <div key={index} className='flex flex-col items-center gap-2'>
            <Image
              src={option.icon}
              alt={`${option.title} icon`}
              width={32}
              height={32}
              sizes='32px'
            />
            <h5 className='text-h2_bold text-green'>{t(option.title)}</h5>
            <p className='text-h2_light text-center'>{t(option.description)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VisionSection;
