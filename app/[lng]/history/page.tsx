import Image from 'next/image';
import Link from 'next/link';

import { useServerTranslation } from '@/i18n';
import { LanguagePageProps } from '../types';
import { urls } from '@/utils/paths';
import { historyReferenceUrl, humanitarianSlideShowImages } from './config';

import Slideshow from '@/components/utils/Slideshow/Slideshow';
import { Trans } from 'react-i18next/TransWithoutContext';

// images
import { euroHawkLogo, hawkLogo } from '@/models/images/logos';
import historyHero from '@/public/images/history/hero.webp';
import { HawkStarsSection } from '@/components/layout';
import humanitarian_1 from '@/public/images/history/humanitarian_1.jpeg';

const HawkHistoryPage = async ({ params: { lng } }: LanguagePageProps) => {
  const { t } = await useServerTranslation(lng, 'hawkstars');
  const { geral, festival, erasmus, report, news } = historyReferenceUrl;

  return (
    <section className='flex flex-col gap-5'>
      <HawkStarsSection bgcolor='begeLight'>
        <div className='flex flex-col gap-12 py-12'>
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
          <div className='grid grid-cols-1 gap-14 lg:grid-cols-2'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-left text-green'>{t('title')}</h1>
              <p className='text-justify'>{t('beginning')}</p>
              <p className='mt-2 text-justify'>{t('euro_hawk')}</p>
            </div>
            <div>
              <Image src={historyHero} alt='fundation of hawkstars' />
            </div>
          </div>
        </div>
      </HawkStarsSection>
      <HawkStarsSection>
        <p className='mr-auto w-1/2 text-left'>{t('euro_hawk_2')}</p>
        <p className='ml-auto w-1/2 text-right'>{t('hawk_stars')}</p>
      </HawkStarsSection>
      <HawkStarsSection bgcolor='green'>
        <HumanitarianHelpSection />
      </HawkStarsSection>
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
      {/* <div className='max-lg:-mx-4'>
        <Slideshow images={humanitarianSlideShowImages} />
      </div> */}
      <HawkStarsSection>
        <div className='flex flex-col gap-7'>
          <Image src={humanitarian_1} alt='Humanitarian help' sizes='100vw' className='w-full' />
          <p className='mr-auto w-1/2 text-left'>{t('foundation')}</p>
        </div>
      </HawkStarsSection>

      <HawkStarsSection>
        <div className='grid grid-cols-1 gap-7 lg:grid-cols-2'>
          <div className='h-full'>
            <Image
              src={humanitarian_1}
              alt='Humanitarian help'
              sizes='100vw'
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className='-mr-40 flex flex-col gap-12 bg-bege-light py-20 pl-16 pr-40'>
            <p className='text-left'>{t('presentation')}</p>
            <div className='mt-5 flex flex-row gap-4'>
              <Link
                href={urls.about}
                className='w-fit rounded-xl border border-green bg-green fill-white p-2 text-white'
              >
                {t('about_hawkstars')}
              </Link>
              <Link
                href={urls.global_village}
                className='w-fit rounded-xl border border-green bg-green fill-white p-2 text-white'
              >
                {t('about_globalvillage')}
              </Link>
            </div>
          </div>
        </div>
      </HawkStarsSection>
    </section>
  );
};

// const ReferencesSection = ({ title, urls }: { title: string; urls: string[] }) => {
//   return (
//     <div className='flex flex-col gap-2'>
//       <h6 className='font-bold'>{title}</h6>
//       <div className='flex flex-row flex-wrap gap-2 text-sm'>
//         {urls.map((url, index) => (
//           <Link href={url} target='_blank' key={index} className='font-black text-green'>
//             {index + 1}.
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

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
