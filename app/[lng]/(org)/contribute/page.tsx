import { ImageMedia } from '@/payload/components/Media';
import Link from 'next/link';
import { getServerTranslation } from '@/i18n';

import ShoppingCardIcon from '@/public/images/icons/common/shopping_cart.svg';
import UserIcon from '@/public/images/icons/contribute/user_single.svg';
import CompanyIcon from '@/public/images/icons/contribute/company.svg';

import ChairsSections from '@/components/contribute/ChairsSection';

// images
import heroImage from '@/public/images/contribute/hero.jpg';
import bankTransferImage from '@/public/images/contribute/bank_transfer.png';
import cryptoTransferImage from '@/public/images/contribute/crypto_transfer.png';
import exterior2 from '@/public/images/training_center/exterior2.jpg';
import trainingRoom from '@/public/images/training_center/meeting_1.jpg';
import coworkingRoom from '@/public/images/training_center/coworking_12.jpg';

// chairs
import simulatorChairNotTaken from '@/public/images/icons/contribute/simulator-empty.svg';
import simulatorChairTaken from '@/public/images/icons/contribute/simulator-fill.svg';
import loungeChairEmpty from '@/public/images/icons/contribute/lounge-empty.svg';
import loungeChair from '@/public/images/icons/contribute/lounge-fill.svg';
import standardLoungeChair from '@/public/images/icons/contribute/lounge.svg';
import standardChair from '@/public/images/icons/contribute/standard.svg';

import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';

import groupBy from 'lodash.groupby';
import BrandingSection from '@/components/contribute/BrandingSection';
import { Contribution } from '@/payload-types';
import { getChairsContributionsQuery } from '@/lib/payload/queries/contribution';
import { Metadata } from 'next';
import { getMetadataPageInfo } from '@/utils/metadata';
import DonationWidget from '@/components/contribute/DonationWidget';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui/SectionHeader';
import { Suspense } from 'react';
import { PageLoading } from '@/components/layout';

export async function generateMetadata(props: {
  params: Promise<{ lng: Language }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'contribute');
  return metadataPage;
}

const getChairsContribute = async () => {
  const data = await getChairsContributionsQuery();
  let contributions = data.docs || [];

  contributions = contributions.map((item) => {
    return { ...item, donor: item.is_anonymous ? '' : item.donor };
  });

  const grouped_contributions = groupBy(contributions, 'contribution_type');
  const simulationChairs = (grouped_contributions['SIMULATOR_CHAIR'] as Contribution[]) || [];
  const officeChairs = (grouped_contributions['OFFICE_CHAIR'] as Contribution[]) || [];
  const auditoriumChairs = (grouped_contributions['AUDITORIUM_CHAIR'] as Contribution[]) || [];
  const loungeChairs = (grouped_contributions['LOUNGE_CHAIR'] as Contribution[]) || [];

  return {
    simulationChairs,
    officeChairs,
    auditoriumChairs,
    loungeChairs,
  };
};

type DonatePageProps = { params: Promise<{ lng: Language }> };

// `getChairsContributionsQuery` is now cached (see lib/payload/queries/contribution.ts),
// but this route also had no <Suspense> above its `params` await, so it stayed
// blocking regardless. Non-async shell + content child, same as the rest.
const DonatePage = (props: DonatePageProps) => (
  <Suspense fallback={<PageLoading />}>
    <DonateContent params={props.params} />
  </Suspense>
);

const DonateContent = async ({ params }: { params: DonatePageProps['params'] }) => {
  const { lng } = await params;

  const [{ t }, { simulationChairs, officeChairs, auditoriumChairs, loungeChairs }] =
    await Promise.all([getServerTranslation(lng, 'contribute'), getChairsContribute()]);

  return (
    <>
      <h1 className='sr-only'>{t('contribute_hero')}</h1>
      <HawkStarsSection padding='none' cap='none' className='flex-col'>
        <p className='text-h2_bold text-green px-4 py-8 text-center lg:hidden'>
          {t('contribute_hero')}
        </p>
        <div className='relative max-w-full'>
          <div className='text-green absolute top-20 left-8 hidden lg:block xl:left-[max(2rem,calc((100%-72rem)/2))]'>
            <p className='text-h1_semibold w-72'>{t('contribute_hero')}</p>
            <Button asChild size='xl' className='mt-6'>
              <a href='#form'>{t('donate_here')}</a>
            </Button>
          </div>
          <ImageMedia src={heroImage} alt={t('a11y.hero_image')} priority />
        </div>
      </HawkStarsSection>

      <HawkStarsSection
        spacing='default'
        className='via-bege-dark bg-linear-to-tr from-neutral-200 from-35% to-neutral-200 to-65%'
      >
        <SectionHeader align='center' title={t('forms_and_modalities')} className='mb-12' />
        <div className='flex flex-col gap-10 md:flex-row'>
          <div className='flex flex-col gap-1 md:flex-1'>
            <ImageMedia
              src={bankTransferImage}
              alt={t('a11y.bank_transfer')}
              className='w-full rounded-lg'
            />
            <h3 className='text-body_semibold mt-5'>{t('options.bank_transfer')}</h3>
            <p className='text-body_regular lg:text-justify'>{t('bank_transfer.description')}</p>
            <div className='text-body_regular mt-1 flex flex-col gap-1 font-bold'>
              <p>
                IBAN: <span className=''>PT50.0036.0053.99100203412.98</span>
              </p>
              <p className='text-body_regular font-bold'>MPIOPTPL</p>
            </div>
          </div>
          <div className='flex flex-col gap-1 md:flex-1'>
            <ImageMedia
              src={cryptoTransferImage}
              alt={t('a11y.crypto_transfer')}
              className='w-full rounded-lg'
            />
            <h3 className='text-body_semibold mt-5'>{t('options.crypto_transfer')}</h3>
            <p className='text-body_regular lg:text-justify'>{t('crypto_transfer.description')}</p>
            <p className='text-body_regular mt-2 font-bold'>
              Metamask:{' '}
              <span className='text-body_regular font-bold break-all'>
                0x085036c6ec33888db0c4cc8f99791537dbc8ab97
              </span>
            </p>
          </div>
        </div>
      </HawkStarsSection>

      <HawkStarsSection spacing='default'>
        <SectionHeader align='center' title={t('other_modalities')} className='mb-8' />
        <div className='flex justify-center'>
          <Button asChild size='xl'>
            <Link
              href='https://shop.hawkstars.org/'
              lang='en'
              target='_blank'
              rel='noopener noreferrer'
            >
              <ImageMedia src={ShoppingCardIcon} alt='' width={20} height={20} />
              {t('store')}
            </Link>
          </Button>
        </div>
      </HawkStarsSection>

      <HawkStarsSection spacing='default' className='bg-bege-light'>
        <div className='flex flex-col gap-10'>
          <SectionHeader align='center' title={t('branding.title')} />
          <div className='flex flex-col gap-10 md:flex-row'>
            <BrandingSection
              image={exterior2}
              altImage={
                'Image of the exterior of the upcoming Hawkstars building to be used for company branding'
              }
              title={t('brand.international_training_center.title')}
              price={t('brand.international_training_center.price')}
              description={t('brand.international_training_center.description')}
            />
            <BrandingSection
              image={coworkingRoom}
              altImage={'Image of the coworking room of the upcoming Hawkstars building'}
              title={t('brand.room_branding.title')}
              price={t('brand.room_branding.price')}
              description={t('brand.room_branding.description')}
            />
          </div>
          <Button asChild size='xl' className='mx-auto'>
            <a href='mailto:geral@hawkstars.org'>{t('contact_us')}</a>
          </Button>
        </div>
      </HawkStarsSection>

      <HawkStarsSection spacing='default'>
        <div className='flex flex-col gap-10 lg:mx-auto lg:w-2/3'>
          <div className='mx-auto flex flex-1 flex-col gap-3'>
            <h3 className='text-h2_bold text-center'>{t('brand.wall_branding.title')}</h3>
            <ImageMedia src={trainingRoom} alt={t('a11y.training_room')} className='rounded-lg' />
            <div className='flex flex-row gap-4'>
              <div className='text-body_semibold text-green flex w-fit flex-row gap-1 rounded-2xl p-2 lg:text-base'>
                <ImageMedia
                  src={UserIcon}
                  alt={t('a11y.user')}
                  width={28}
                  height={28}
                  className='my-auto'
                />
                <p className='self-center'>{t('brand.wall_branding.price_solo')}</p>
              </div>
              <div className='text-body_semibold text-green flex w-fit flex-row gap-1 rounded-2xl p-2 lg:text-base'>
                <ImageMedia
                  src={CompanyIcon}
                  alt={t('a11y.company')}
                  width={28}
                  height={28}
                  className='my-auto'
                />
                <p className='self-center'>{t('brand.wall_branding.price_company')}</p>
              </div>
            </div>
            <p className='text-body_regular'>{t('brand.wall_branding.description')}</p>
          </div>
        </div>
      </HawkStarsSection>

      <HawkStarsSection spacing='default' className='bg-bege-light'>
        <SectionHeader align='center' title={t('brand.chairs.title')} className='mb-8' />
        <ChairsSections
          title={t('brand.chairs.types.gaming_chair')}
          price='300€'
          icon={<ImageMedia src={loungeChairEmpty} alt={t('a11y.chair_empty')} />}
          iconFilled={<ImageMedia src={loungeChair} alt={t('a11y.chair_taken')} />}
          size={60}
          currentContributions={loungeChairs}
        />
        <ChairsSections
          title={t('brand.chairs.types.simulation_chair')}
          price='350€'
          icon={<ImageMedia src={simulatorChairNotTaken} alt={t('a11y.chair_empty')} />}
          iconFilled={<ImageMedia src={simulatorChairTaken} alt={t('a11y.chair_taken')} />}
          size={2}
          currentContributions={simulationChairs}
        />

        <ChairsSections
          title={t('brand.chairs.types.lounge_chair')}
          price='260€'
          icon={
            <ImageMedia
              src={standardLoungeChair}
              className='h-12 w-12'
              alt={t('a11y.chair_empty')}
            />
          }
          iconFilled={
            <ImageMedia
              src={standardLoungeChair}
              className='fill-green h-12 w-12'
              alt={t('a11y.chair_taken')}
            />
          }
          size={40}
          currentContributions={officeChairs}
        />
        <ChairsSections
          title={t('brand.chairs.types.auditorium_chair')}
          price='200€'
          icon={
            <ImageMedia src={standardChair} className='h-12 w-12' alt={t('a11y.chair_empty')} />
          }
          iconFilled={
            <ImageMedia
              src={standardChair}
              className='fill-green h-12 w-12'
              alt={t('a11y.chair_taken')}
            />
          }
          size={110}
          currentContributions={auditoriumChairs}
        />
      </HawkStarsSection>

      <HawkStarsSection spacing='default' id='form'>
        <SectionHeader align='center' title={t('helps_us_donate')} className='mb-8' />
        <div className='flex justify-center'>
          <DonationWidget />
        </div>
      </HawkStarsSection>
    </>
  );
};

export default DonatePage;
