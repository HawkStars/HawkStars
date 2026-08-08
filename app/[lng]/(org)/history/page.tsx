import { ImageMedia } from '@/payload/components/Media';
import Link from 'next/link';

import { getServerTranslation } from '@/i18n';
import { LanguagePageProps } from '../types';
import { historyReferenceUrl } from './config';

// images
import { euroHawkLogo, hawkLogo } from '@/utils/models/images/logos';
import historyHero from '@/public/images/history/hero.webp';
import { HawkStarsOffSetSection, HawkStarsSection } from '@/components/layout';
import humanitarian_1 from '@/public/images/history/humanitarian_1.jpeg';
import global_village_image from '@/public/images/hero.png';
import { OffsetSection } from '@/components/layout/OffsetSection';
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

// `getServerTranslation` resolves a dynamic `import()` of the locale JSON, which
// under `cacheComponents` counts as uncached data reached outside a boundary and
// makes the whole route blocking. This page has no other data and depends only on
// `lng` (enumerated by the layout's `generateStaticParams`), so caching the body
// makes it fully static — same reasoning as the layout's SkipToContent.
async function HistoryContent({ lng }: { lng: string }) {
  'use cache';
  const { t } = await getServerTranslation(lng as Language, 'hawkstars');
  const { report } = historyReferenceUrl;

  return (
    <HawkStarsSection>
      <section className='flex flex-col gap-5'>
        <OffsetSection bgColor='bege-light'>
          <div className='flex flex-col gap-12 px-4 py-12 xl:px-40'>
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
                <ImageMedia
                  src={hawkLogo}
                  alt={t('history.alt.hawkStarsLogo')}
                  className='my-auto'
                />
              </div>
            </div>
            <div className='mt-5 grid grid-cols-1 gap-14 xl:grid-cols-2'>
              <div className='flex flex-col gap-4'>
                <h1 className='text-h1_semibold text-green text-left'>{t('title')}</h1>
                <p className='text-body_regular text-justify'>{t('beginning')}</p>
                <p className='text-body_regular mt-2 text-justify'>{t('euro_hawk')}</p>
              </div>
              <div className='mx-auto max-xl:-mx-4 max-xl:flex max-xl:justify-center'>
                <ImageMedia src={historyHero} alt={t('history.alt.foundation')} />
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
          <HumanitarianHelpSection t={t} />
        </HawkStarsOffSetSection>
        <div className='mx-auto pt-4 pb-6 xl:pb-10'>
          <Link
            href={report}
            target='_blank'
            className='border-green bg-green w-fit rounded-xl border fill-white p-2 text-white'
          >
            {t('history.checkReport')}
          </Link>
        </div>

        <div className='flex flex-col'>
          <div className='max-xl:-mx-4'>
            <ImageMedia src={humanitarian_1} alt='Humanitarian help' sizes='100vw' />
          </div>
          <div className='mt-20 mr-auto flex flex-col gap-2 text-left xl:w-1/2'>
            <h2 className='text-h1_semibold text-disabled'>{t('foundation_heading')}</h2>
            <p className='text-body_regular'>{t('foundation')}</p>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-7 xl:grid-cols-2'>
          <div className='h-full max-xl:-mx-4'>
            <ImageMedia
              loading='lazy'
              src={global_village_image}
              className='aspect-[1.2] w-full overflow-hidden object-contain object-center max-sm:max-w-full sm:pr-0 lg:mt-10 lg:pr-0'
              alt={t('history.alt.hero')}
            />
          </div>
          <div className='bg-bege-light flex flex-col gap-12 p-3 py-14 max-xl:-mx-4 lg:p-10 lg:py-20 xl:-mr-40 xl:pr-40 xl:pl-16'>
            <p className='text-large_regular text-left'>{t('presentation')}</p>
            <div className='mt-5 flex flex-col gap-4 md:flex-row'>
              <Link
                href={`${lng}/ong`}
                className='border-green bg-green w-full rounded-xl border fill-white p-2 text-center text-white xl:w-fit'
              >
                {t('about_hawkstars')}
              </Link>
              <Link
                href={`${lng}/village`}
                className='border-green bg-green w-full rounded-xl border fill-white p-2 text-center text-white xl:w-fit'
              >
                {t('about_globalvillage')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </HawkStarsSection>
  );
}

type TranslateFn = Awaited<ReturnType<typeof getServerTranslation>>['t'];

const HumanitarianHelpSection = ({ t }: { t: TranslateFn }) => {
  return (
    <section className='bg-green px-4 py-10'>
      <div className='mx-auto grid gap-16 lg:w-5/6 lg:grid-cols-2'>
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
      <div className='mx-auto mt-20 grid gap-8 lg:w-5/6 lg:grid-cols-2'>
        <ContainerHumanitarianHelp
          title={t('humanitarian.deliveredTons.title')}
          description={t('humanitarian.deliveredTons.description')}
        />
        <ContainerHumanitarianHelp
          title={t('humanitarian.contributions.title')}
          description={t('humanitarian.contributions.description')}
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
    <div className='text-bege-light flex flex-col gap-1'>
      <div className='flex-end flex'>
        <p className='text-bege-light'>
          <span className='text-h1_semibold text-bege-dark mr-1'>{number}</span>
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
    <div className='bg-bege-dark flex flex-col gap-16 px-4 py-14 xl:px-12'>
      <div className='flex-end flex'>
        <p className='text-h2_bold border-green bg-green ml-1 w-fit rounded-xl border fill-white p-2 text-white'>
          {title}
        </p>
      </div>
      {description && <p className='text-large_regular text-green'>{description}</p>}
    </div>
  );
};

export default HawkHistoryPage;
