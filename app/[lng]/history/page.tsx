import Image from 'next/image';
import Link from 'next/link';

import { useServerTranslation } from '@/i18n';
import { LanguagePageProps } from '../types';
import { urls } from '@/utils/paths';
import { historyReferenceUrl } from './config';

// images
import { euroHawkLogo, hawkLogo } from '@/models/images/logos';
import historyHero from '@/public/images/history/hero.webp';
import { HawkStarsSection } from '@/components/layout';
import humanitarian_1 from '@/public/images/history/humanitarian_1.jpeg';

const HawkHistoryPage = async ({ params: { lng } }: LanguagePageProps) => {
  const { t } = await useServerTranslation(lng, 'hawkstars');
  const { report } = historyReferenceUrl;

  return (
    <section className='flex flex-col gap-5'>
      <HawkStarsSection bgcolor='begeLight'>
        <div className='flex flex-col gap-12 py-12'>
          <div className='flex justify-around gap-4 xl:px-10'>
            <Image
              src={euroHawkLogo}
              alt='euro hawk logo'
              className='max-xl:my-auto max-xl:h-10 max-xl:w-10'
            />

            <div className='flex w-full'>
              <div className='my-auto h-4 w-4 rounded-xl bg-green'></div>
              <div className='my-auto h-1 w-full bg-green'></div>
              <div className='my-auto h-0 w-0 border-y-8 border-l-[16px] border-y-transparent border-l-green'></div>
            </div>
            <div className='aspect-video max-xl:h-14 xl:max-w-[250px]'>
              <Image src={hawkLogo} alt='hawk stars logo' className='my-auto' />
            </div>
          </div>
          <div className='mt-5 grid grid-cols-1 gap-14 xl:grid-cols-2'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-left text-green'>{t('title')}</h1>
              <p className='text-justify'>{t('beginning')}</p>
              <p className='mt-2 text-justify'>{t('euro_hawk')}</p>
            </div>
            <div className='max-xl:-mx-4'>
              <Image src={historyHero} alt='fundation of hawkstars' />
            </div>
          </div>
        </div>
      </HawkStarsSection>
      <HawkStarsSection>
        <div className='flex flex-col gap-3 py-12 xl:py-32'>
          <p className='mr-auto text-left xl:w-1/2'>{t('euro_hawk_2')}</p>
          <p className='ml-auto text-left xl:w-1/2 xl:text-right'>{t('hawk_stars')}</p>
        </div>
      </HawkStarsSection>
      <HawkStarsSection bgcolor='green'>
        <HumanitarianHelpSection />
      </HawkStarsSection>
      <div className='mx-auto pb-6 pt-4 xl:pb-10'>
        <Link
          href={report}
          target='_blank'
          className='w-fit rounded-xl border border-green bg-green fill-white p-2 text-white'
        >
          Check the Report here.
        </Link>
      </div>

      <HawkStarsSection>
        <div className='flex flex-col gap-7'>
          <div className='max-xl:-mx-4'>
            <Image src={humanitarian_1} alt='Humanitarian help' sizes='100vw' />
          </div>
          <p className='mr-auto text-left xl:w-1/2'>{t('foundation')}</p>
        </div>
      </HawkStarsSection>
      <HawkStarsSection>
        <div className='grid grid-cols-1 gap-7 xl:grid-cols-2'>
          <div className='h-full max-xl:-mx-4'>
            <Image
              src={humanitarian_1}
              alt='Humanitarian help'
              sizes='100vw'
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className='flex flex-col gap-12 bg-bege-light p-3 py-14 max-xl:-mx-4 lg:p-10 lg:py-20 xl:-mr-40 xl:pl-16 xl:pr-40'>
            <p className='text-left'>{t('presentation')}</p>
            <div className='mt-5 flex flex-col gap-4 xl:flex-row'>
              <Link
                href={urls.about}
                className='w-full rounded-xl border border-green bg-green fill-white p-2 text-center text-white xl:w-fit'
              >
                {t('about_hawkstars')}
              </Link>
              <Link
                href={urls.global_village}
                className='w-full rounded-xl border border-green bg-green fill-white p-2 text-center text-white xl:w-fit'
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

const HumanitarianHelpSection = () => {
  return (
    <section className='mx-auto bg-green py-10 lg:w-5/6 lg:px-4'>
      <div className='grid gap-16 lg:grid-cols-2'>
        <HumanitarianHelpInfoPoints
          number='90'
          smallTitle='pessoas'
          description='entre responsáveis pela organização, parceiros, voluntários e amigos que colaboraram até o objetivo final estar cumprido'
        />
        <HumanitarianHelpInfoPoints
          number='18'
          smallTitle='instituições'
          description='públicas e/ou privadas'
        />
        <HumanitarianHelpInfoPoints
          number='23'
          smallTitle='corporações'
          description='de bombeiros'
        />
        <HumanitarianHelpInfoPoints
          number='7'
          smallTitle='instituições'
          description='internacionais'
        />
        <HumanitarianHelpInfoPoints number='5' smallTitle='caminhões' />
        <HumanitarianHelpInfoPoints number='6' smallTitle='motoristas' />
        <HumanitarianHelpInfoPoints number='24.500€' description='valor estimado da operação' />
        <HumanitarianHelpInfoPoints number='30.342km' description='percorridos' />
      </div>
      <div className='mt-20 grid gap-8 lg:grid-cols-2'>
        <ContainerHumanitarianHelp
          title={'90 toneladas'}
          description={'de material entregues na Ucrânia'}
        />
        <ContainerHumanitarianHelp
          title={'Milhares'}
          description={'de contribuições humanitárias em todo o Distrito'}
        />
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
    <div className='flex flex-col gap-1 text-bege-light'>
      <div className='flex-end flex'>
        <p className='text-bege-light'>
          <span className='mr-1 text-5xl font-semibold text-bege-dark'>{number}</span>
          {smallTitle ? smallTitle : ''}
        </p>
      </div>
      {description && <p className='ml-1 w-5/6'>{description}</p>}
    </div>
  );
};

type ContainerHumanitarianHelpProps = {
  title: string;
  description: string;
};
const ContainerHumanitarianHelp = ({ title, description }: ContainerHumanitarianHelpProps) => {
  return (
    <div className='flex flex-col gap-16 bg-bege-dark px-4 py-14 xl:px-12'>
      <div className='flex-end flex font-light'>
        <p className='ml-1 w-fit rounded-xl border border-green bg-green fill-white p-2 text-white'>
          {title}
        </p>
      </div>
      {description && <p className='text-green'>{description}</p>}
    </div>
  );
};

export default HawkHistoryPage;
