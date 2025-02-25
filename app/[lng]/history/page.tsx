import Image from 'next/image';
import Link from 'next/link';

import { getServerTranslation } from '@/i18n';
import { LanguagePageProps } from '../types';
import { urls } from '@/utils/paths';
import { historyReferenceUrl } from './config';

// images
import { euroHawkLogo, hawkLogo } from '@/utils/models/images/logos';
import historyHero from '@/public/images/history/hero.webp';
import { HawkStarsOffSetSection, HawkStarsSection } from '@/components/layout';
import humanitarian_1 from '@/public/images/history/humanitarian_1.jpeg';
import global_village_image from '@/public/images/hero.png';
import { OffsetSection } from '@/components/layout/OffsetSection';

const HawkHistoryPage = async (props: LanguagePageProps) => {
  const params = await props.params;

  const { lng } = params;

  const { t } = await getServerTranslation(lng, 'hawkstars');
  const { report } = historyReferenceUrl;

  return (
    <HawkStarsSection>
      <section className='flex flex-col gap-5'>
        <OffsetSection bgColor='bege-light'>
          <div className='flex flex-col gap-12 px-4 py-12 xl:px-40'>
            <div className='flex justify-around gap-4 xl:px-10'>
              <Image
                src={euroHawkLogo}
                alt='euro hawk logo'
                className='max-xl:my-auto max-xl:h-auto max-xl:w-14'
              />

              <div className='flex flex-1'>
                <div className='my-auto h-4 w-4 rounded-xl bg-green'></div>
                <div className='my-auto h-1 w-full bg-green'></div>
                <div className='my-auto h-0 w-0 border-y-8 border-l-[16px] border-y-transparent border-l-green'></div>
              </div>
              <div className='flex aspect-video max-xl:h-14 xl:max-w-[250px]'>
                <Image src={hawkLogo} alt='hawk stars logo' className='my-auto' />
              </div>
            </div>
            <div className='mt-5 grid grid-cols-1 gap-14 xl:grid-cols-2'>
              <div className='flex flex-col gap-4'>
                <h1 className='text-h1_semibold text-left text-green'>{t('title')}</h1>
                <p className='text-body_regular text-justify'>{t('beginning')}</p>
                <p className='text-body_regular mt-2 text-justify'>{t('euro_hawk')}</p>
              </div>
              <div className='max-xl:-mx-4 max-xl:flex max-xl:justify-center'>
                <Image src={historyHero} alt='foundation of hawkstars' />
              </div>
            </div>
          </div>
        </OffsetSection>

        <div className='flex flex-col gap-3 py-12 xl:py-32'>
          <p className='text-body_regular text-body_regular mr-auto text-left xl:w-1/2'>
            {t('euro_hawk_2')}
          </p>
          <p className='text-body_regular ml-auto text-left xl:w-1/2 xl:text-right'>
            {t('hawk_stars')}
          </p>
        </div>

        <HawkStarsOffSetSection bgColor='green'>
          <HumanitarianHelpSection />
        </HawkStarsOffSetSection>
        <div className='mx-auto pb-6 pt-4 xl:pb-10'>
          <Link
            href={report}
            target='_blank'
            className='w-fit rounded-xl border border-green bg-green fill-white p-2 text-white'
          >
            Check the Report here.
          </Link>
        </div>

        <div className='flex flex-col'>
          <div className='max-xl:-mx-4'>
            <Image src={humanitarian_1} alt='Humanitarian help' sizes='100vw' />
          </div>
          <div className='mr-auto mt-20 flex flex-col gap-2 text-left xl:w-1/2'>
            <h4 className='text-h1_semibold text-disabled'>{t('foundation_heading')}</h4>
            <p className='text-body_regular'>{t('foundation')}</p>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-7 xl:grid-cols-2'>
          <div className='h-full max-xl:-mx-4'>
            <Image
              loading='lazy'
              src={global_village_image}
              className='aspect-[1.2] w-full overflow-hidden object-contain object-center max-sm:max-w-full sm:pr-0 lg:mt-10 lg:pr-0'
              alt='hero'
            />
          </div>
          <div className='flex flex-col gap-12 bg-bege-light p-3 py-14 max-xl:-mx-4 lg:p-10 lg:py-20 xl:-mr-40 xl:pl-16 xl:pr-40'>
            <p className='text-large_regular text-left'>{t('presentation')}</p>
            <div className='mt-5 flex flex-col gap-4 md:flex-row'>
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
      </section>
    </HawkStarsSection>
  );
};

const HumanitarianHelpSection = () => {
  return (
    <section className='bg-green px-4 py-10'>
      <div className='mx-auto grid gap-16 lg:w-5/6 lg:grid-cols-2'>
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
      <div className='mx-auto mt-20 grid gap-8 lg:w-5/6 lg:grid-cols-2'>
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
          <span className='text-h1_semibold mr-1 font-semibold text-bege-dark'>{number}</span>
          {smallTitle ? smallTitle : ''}
        </p>
      </div>
      {description && <p className='text-large_semibold ml-1 w-5/6'>{description}</p>}
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
        <p className='text-h2_bold ml-1 w-fit rounded-xl border border-green bg-green fill-white p-2 text-white'>
          {title}
        </p>
      </div>
      {description && <p className='text-large_regular text-green'>{description}</p>}
    </div>
  );
};

export default HawkHistoryPage;
