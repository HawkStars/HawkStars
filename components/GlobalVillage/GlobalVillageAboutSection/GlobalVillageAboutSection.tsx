import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { GLOBAL_VILLAGE_ABOUT_SECTIONS } from './config';

import ObjectiveSection from './ObjectiveSection';
import DonateLink from '../DonateLink/DonateLink';

const GlobalVillageAboutSection = async ({ lng }: LanguageProps) => {
  const { t } = await getServerTranslation(lng, 'training_center');
  return (
    <section>
      <div className='mx-3 mb-10 flex max-w-6xl flex-col gap-10 px-0 lg:mx-auto lg:px-8'>
        <h2 className='text-center'>{t('about.title')}</h2>
        <p>{t('about.description')}</p>
      </div>
      <div className='bg-bege-light py-20'>
        <div className='mx-3 flex max-w-6xl flex-col gap-8 lg:mx-auto lg:flex-row'>
          {GLOBAL_VILLAGE_ABOUT_SECTIONS.map((section, index) => (
            <ObjectiveSection {...section} key={index} lng={lng} index={index} />
          ))}
        </div>
        <div className='mt-10 flex justify-center'>
          <DonateLink />
        </div>
      </div>
    </section>
  );
};

export default GlobalVillageAboutSection;
