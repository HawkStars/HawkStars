import Image from 'next/image';
import Link from 'next/link';

import { useServerTranslation } from '@/i18n';
import { LanguagePageProps } from '../types';
import { ABOUT_US_URL, GLOBAL_VILLAGE_URL } from '@/utils/paths';
import { historyReferenceUrl, humanitarianSlideShowImages } from './config';

import Slideshow from '@/components/utils/Slideshow/Slideshow';
import { Trans } from 'react-i18next/TransWithoutContext';

// images
import { euroHawkLogo, hawkLogo } from '@/models/images/logos';
import historyHero from '@/public/images/history/hero.webp';

const HawkHistoryPage = async ({ params: { lng } }: LanguagePageProps) => {
  const { t } = await useServerTranslation(lng, 'hawkstars');
  const { geral, festival, erasmus, report, news } = historyReferenceUrl;

  return (
    <section className='layout-section full-width flex flex-col gap-5 bg-bege-light'>
      <div className='flex flex-col gap-12 lg:p-24'>
        <div className='flex justify-around gap-4 px-10'>
          <Image src={euroHawkLogo} alt='euro hawk logo' />

          <div className='flex w-full'>
            <div className='my-auto h-4 w-4 rounded-xl bg-green'></div>
            <div className='my-auto h-1 w-full bg-green'></div>
            <div className='my-auto h-0 w-0 border-y-8 border-l-[16px] border-y-transparent border-l-green'></div>
          </div>
          <div className='my-auto max-w-[250px]'>
            <Image src={hawkLogo} alt='hawk stars logo' />
          </div>
        </div>
        <div className='grid grid-cols-2'>
          <div>
            <h1 className='text-center'>{t('title')}</h1>
            <p className='text-justify'>{t('beginning')}</p>
            <p className='text-justify'>{t('euro_hawk')}</p>
            <p className='text-justify'>{t('euro_hawk_2')}</p>
            <p className='text-justify'>{t('hawk_stars')}</p>
          </div>
          <div>
            <Image src={historyHero} alt='fundation of hawkstars' />
          </div>
        </div>
      </div>

      <p className='text-justify'>
        <Trans
          i18nKey='humanitary'
          t={t}
          components={{
            report: (
              <>
                <Link href={report[0]} target='_blank' className='font-black text-green'>
                  Check the Report here.
                </Link>
              </>
            ),
          }}
        />
      </p>
      <div className='max-lg:-mx-4'>
        <Slideshow images={humanitarianSlideShowImages} />
      </div>
      <p className='text-justify'>{t('foundation')}</p>
      <p className='text-justify'>{t('presentation')}</p>

      <div className='mt-5 flex flex-row gap-4'>
        <Link
          href={ABOUT_US_URL}
          className='w-fit rounded-xl border border-green bg-green fill-white p-2 text-white'
        >
          {t('about_hawkstars')}
        </Link>
        <Link
          href={GLOBAL_VILLAGE_URL}
          className='w-fit rounded-xl border border-green bg-green fill-white p-2 text-white'
        >
          {t('about_globalvillage')}
        </Link>
      </div>

      <div className='mt-10 flex flex-col gap-3'>
        <h3 className='text-xl font-bold text-green'>{t('urls.eurohawks')}</h3>
        <ReferencesSection title='Main' urls={geral} />
        <ReferencesSection title='Erasmus +' urls={erasmus} />
        <ReferencesSection title='Hawk Festival' urls={festival} />
      </div>
      <div className='flex flex-col gap-3'>
        <h3 className='text-xl font-bold text-green'>{t('urls.fnee')}</h3>
        <ReferencesSection title='Report' urls={report} />
        <ReferencesSection title='News' urls={news} />
      </div>
      <HumanitarianHelpSection />
    </section>
  );
};

const ReferencesSection = ({ title, urls }: { title: string; urls: string[] }) => {
  return (
    <div className='flex flex-col gap-2'>
      <h6 className='font-bold'>{title}</h6>
      <div className='flex flex-row flex-wrap gap-2 text-sm'>
        {urls.map((url, index) => (
          <Link href={url} target='_blank' key={index} className='font-black text-green'>
            {index + 1}.
          </Link>
        ))}
      </div>
    </div>
  );
};

const HumanitarianHelpSection = () => {
  return (
    <section className='bg-green px-4 py-10'>
      <div className='grid grid-cols-2 gap-16'>
        <div className='flex flex-col gap-10'>
          <HumanitarianHelpInfoPoints
            number='90'
            smallTitle='pessoas'
            description='entre responsáveis pela organização, parceiros, voluntários e amigos que colaboraram até o objetivo final estar cumprido'
          />
          <HumanitarianHelpInfoPoints
            number='23'
            smallTitle='pessoas'
            description='entre responsáveis pela organização, parceiros, voluntários e amigos que colaboraram até o objetivo final estar cumprido'
          />
          <HumanitarianHelpInfoPoints
            number='5'
            smallTitle='pessoas'
            description='entre responsáveis pela organização, parceiros, voluntários e amigos que colaboraram até o objetivo final estar cumprido'
          />
          <HumanitarianHelpInfoPoints
            number='30.342km'
            smallTitle='pessoas'
            description='entre responsáveis pela organização, parceiros, voluntários e amigos que colaboraram até o objetivo final estar cumprido'
          />
          <ContainerHumanitarianHelp
            title={'90 toneladas'}
            description={'de material entregues na Ucrânia'}
          />
        </div>
        <div>
          <HumanitarianHelpInfoPoints
            number='18'
            smallTitle='pessoas'
            description='entre responsáveis pela organização, parceiros, voluntários e amigos que colaboraram até o objetivo final estar cumprido'
          />
          <HumanitarianHelpInfoPoints
            number='7'
            smallTitle='pessoas'
            description='entre responsáveis pela organização, parceiros, voluntários e amigos que colaboraram até o objetivo final estar cumprido'
          />
          <HumanitarianHelpInfoPoints
            number='6'
            smallTitle='pessoas'
            description='entre responsáveis pela organização, parceiros, voluntários e amigos que colaboraram até o objetivo final estar cumprido'
          />
          <HumanitarianHelpInfoPoints
            number='24.500€'
            smallTitle='pessoas'
            description='entre responsáveis pela organização, parceiros, voluntários e amigos que colaboraram até o objetivo final estar cumprido'
          />
        </div>
      </div>
    </section>
  );
};

type HumanitarianHelpInfoPointsProps = {
  number: string;
  smallTitle?: string;
  description?: string;
};

const HumanitarianHelpInfoPoints = ({
  number,
  smallTitle,
  description,
}: HumanitarianHelpInfoPointsProps) => {
  return (
    <div className='flex flex-col gap-2 text-bege-light'>
      <p className='flex gap-1'>
        <span className='text-5xl font-semibold'>{number}</span>
        {smallTitle ? smallTitle : ''}
      </p>
      {description && <p>{description}</p>}
    </div>
  );
};

type ContainerHumanitarianHelpProps = {
  title: string;
  description: string;
};
const ContainerHumanitarianHelp = ({ title, description }: ContainerHumanitarianHelpProps) => {
  return <div className='bg-bege-dark px-12 py-14'></div>;
};

export default HawkHistoryPage;
