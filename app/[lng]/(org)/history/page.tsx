import { ImageMedia } from '@/payload/components/Media';
import Link from 'next/link';

import { getServerTranslation } from '@/i18n';
import { LanguagePageProps } from '../types';
import { historyReferenceUrl } from './config';

// images
import { euroHawkLogo, hawkLogo } from '@/utils/models/images/logos';
import historyHero from '@/public/images/history/hero.webp';
import { HawkStarsSection } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { transformUrl } from '@/utils/paths';
import humanitarian_1 from '@/public/images/history/humanitarian_1.jpeg';
import global_village_image from '@/public/images/hero.png';
import { Metadata } from 'next';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'history');
  return metadataPage;
}

const HawkHistoryPage = async (props: LanguagePageProps) => {
  const { lng } = await props.params;
  return <HistoryContent lng={lng} />;
};

async function HistoryContent({ lng }: { lng: string }) {
  const { t } = await getServerTranslation(lng as Language, 'hawkstars');
  const { report } = historyReferenceUrl;

  return (
    <>
      <HawkStarsSection spacing='tight' className='bg-bege-light'>
        <div className='flex flex-col gap-12'>
          <div className='flex justify-around gap-4 xl:px-10'>
            <ImageMedia
              src={euroHawkLogo}
              alt={t('history.alt.euroHawkLogo')}
              className='max-xl:my-auto max-xl:h-auto max-xl:w-14'
            />

            <div className='flex flex-1'>
              <div className='bg-green my-auto h-4 w-4 rounded-xl'></div>
              <div className='bg-green my-auto h-1 w-full'></div>
              <div className='border-l-green my-auto h-0 w-0 border-y-8 border-l-16 border-y-transparent'></div>
            </div>
            <div className='flex aspect-video max-xl:h-14 xl:max-w-62.5'>
              <ImageMedia src={hawkLogo} alt={t('history.alt.hawkStarsLogo')} className='my-auto' />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-14 xl:grid-cols-2'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-display text-green'>{t('title')}</h1>
              <p className='text-body_regular'>{t('beginning')}</p>
              <p className='text-body_regular'>{t('euro_hawk')}</p>
            </div>
            <div className='flex justify-center'>
              <ImageMedia src={historyHero} alt={t('history.alt.foundation')} priority />
            </div>
          </div>
        </div>
      </HawkStarsSection>

      <HawkStarsSection spacing='default'>
        <div className='flex flex-col gap-6'>
          <p className='text-body_regular mr-auto xl:w-1/2'>{t('euro_hawk_2')}</p>
          <p className='text-body_regular ml-auto xl:w-1/2 xl:text-right'>{t('hawk_stars')}</p>
        </div>
      </HawkStarsSection>

      <HawkStarsSection spacing='default' className='bg-green'>
        <HumanitarianHelpSection t={t} />
        <div className='mt-14 flex justify-center'>
          <Button asChild variant='inverse' size='xl'>
            <Link href={report} target='_blank' rel='noopener noreferrer'>
              {t('history.checkReport')}
            </Link>
          </Button>
        </div>
      </HawkStarsSection>

      <HawkStarsSection padding='none' cap='none'>
        <ImageMedia src={humanitarian_1} alt='' sizes='100vw' className='w-full' />
      </HawkStarsSection>

      <HawkStarsSection spacing='default'>
        <div className='flex flex-col gap-2 xl:w-1/2'>
          <h2 className='text-h1_semibold text-disabled'>{t('foundation_heading')}</h2>
          <p className='text-body_regular'>{t('foundation')}</p>
        </div>
      </HawkStarsSection>

      <HawkStarsSection spacing='default' className='bg-bege-light'>
        <div className='grid grid-cols-1 items-center gap-10 xl:grid-cols-2'>
          <ImageMedia
            loading='lazy'
            src={global_village_image}
            className='aspect-[1.2] w-full object-contain object-center'
            alt={t('history.alt.hero')}
          />
          <div className='flex flex-col gap-8'>
            <p className='text-lg'>{t('presentation')}</p>
            <div className='flex flex-col gap-4 md:flex-row'>
              <Button asChild size='xl'>
                <Link href={transformUrl(lng, '/ong')}>{t('about_hawkstars')}</Link>
              </Button>
              <Button asChild size='xl'>
                <Link href={transformUrl(lng, '/village')}>{t('about_globalvillage')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </HawkStarsSection>
    </>
  );
}

type TranslateFn = Awaited<ReturnType<typeof getServerTranslation>>['t'];

const HumanitarianHelpSection = ({ t }: { t: TranslateFn }) => {
  return (
    <div>
      <div className='grid gap-16 lg:grid-cols-2'>
        <HumanitarianHelpInfoPoints
          number='90'
          smallTitle={t('humanitarian.people.label')}
          description={t('humanitarian.people.description')}
        />
        <HumanitarianHelpInfoPoints
          number='18'
          smallTitle={t('humanitarian.institutions.label')}
          description={t('humanitarian.institutions.description')}
        />
        <HumanitarianHelpInfoPoints
          number='23'
          smallTitle={t('humanitarian.fireBrigades.label')}
          description={t('humanitarian.fireBrigades.description')}
        />
        <HumanitarianHelpInfoPoints
          number='7'
          smallTitle={t('humanitarian.internationalInstitutions.label')}
          description={t('humanitarian.internationalInstitutions.description')}
        />
        <HumanitarianHelpInfoPoints number='5' smallTitle={t('humanitarian.trucks.label')} />
        <HumanitarianHelpInfoPoints number='6' smallTitle={t('humanitarian.drivers.label')} />
        <HumanitarianHelpInfoPoints
          number='24.500€'
          description={t('humanitarian.operationValue.description')}
        />
        <HumanitarianHelpInfoPoints
          number='30.342km'
          description={t('humanitarian.distanceTraveled.description')}
        />
      </div>
      <div className='mt-20 grid gap-8 lg:grid-cols-2'>
        <ContainerHumanitarianHelp
          title={t('humanitarian.deliveredTons.title')}
          description={t('humanitarian.deliveredTons.description')}
        />
        <ContainerHumanitarianHelp
          title={t('humanitarian.contributions.title')}
          description={t('humanitarian.contributions.description')}
        />
      </div>
    </div>
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
    <div className='text-bege-light flex flex-col gap-1'>
      <div className='flex-end flex'>
        <p className='text-bege-light'>
          <span className='text-h1_semibold text-bege-dark mr-1'>{number}</span>
          {smallTitle ? smallTitle : ''}
        </p>
      </div>
      {description && <p className='ml-1 w-5/6 text-lg font-semibold'>{description}</p>}
    </div>
  );
};

type ContainerHumanitarianHelpProps = {
  title: string;
  description: string;
};
const ContainerHumanitarianHelp = ({ title, description }: ContainerHumanitarianHelpProps) => {
  return (
    <div className='bg-bege-dark flex flex-col gap-16 px-4 py-14 xl:px-12'>
      <div className='flex-end flex'>
        <p className='text-h2_bold bg-green w-fit rounded-md px-4 py-2 text-white'>{title}</p>
      </div>
      {description && <p className='text-green text-lg'>{description}</p>}
    </div>
  );
};

export default HawkHistoryPage;
