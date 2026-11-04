import { ImageMedia } from '@/payload/components/Media';
import Link from 'next/link';
import { getServerTranslation } from '@/i18n';

import { LuBitcoin, LuLandmark, LuShieldCheck, LuShoppingBag } from 'react-icons/lu';
import UserIcon from '@/public/images/icons/contribute/user_single.svg';
import CompanyIcon from '@/public/images/icons/contribute/company.svg';

import ChairsSections from '@/components/contribute/ChairsSection';
import PaymentMethodCard from '@/components/contribute/PaymentMethodCard';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';

// images
import exterior2 from '@/public/images/training_center/exterior2.jpg';
import trainingRoom from '@/public/images/training_center/meeting_1.jpg';
import coworkingRoom from '@/public/images/training_center/coworking_12.jpg';

// chairs
import simulatorChairTaken from '@/public/images/icons/contribute/simulator-fill.svg';
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
import { PageHero, PageLoading } from '@/components/layout';

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
      <PageHero
        variant='green'
        eyebrow={t('page.eyebrow')}
        title={t('page.title')}
        description={t('page.description')}
        actions={
          <>
            <Button asChild variant='accent' size='xl'>
              <a href='#form'>{t('page.donate_now')}</a>
            </Button>
            <Button asChild variant='outline-inverse' size='xl'>
              <a href='#ways'>{t('page.see_ways')}</a>
            </Button>
          </>
        }
      />

      {/* The online form comes first: it is what most visitors came to do */}
      <HawkStarsSection spacing='default' id='form'>
        <SectionHeader
          align='center'
          eyebrow={t('page.donate_eyebrow')}
          title={t('helps_us_donate')}
          className='mb-10'
        />
        <div className='flex justify-center'>
          <DonationWidget />
        </div>
      </HawkStarsSection>

      <HawkStarsSection spacing='default' id='ways' className='bg-bege-light'>
        <SectionHeader
          align='center'
          eyebrow={t('page.ways_eyebrow')}
          title={t('forms_and_modalities')}
          subtitle={t('page.ways_subtitle')}
          className='mb-10'
        />
        <div className='grid gap-6 md:grid-cols-2'>
          <PaymentMethodCard
            icon={LuLandmark}
            title={t('options.bank_transfer')}
            description={t('bank_transfer.description')}
            details={[
              { label: 'IBAN', value: 'PT50 0036 0053 9910 0203 4129 8' },
              { label: t('page.bic'), value: 'MPIOPTPL' },
            ]}
          />
          <PaymentMethodCard
            icon={LuBitcoin}
            title={t('options.crypto_transfer')}
            description={t('crypto_transfer.description')}
            details={[
              { label: t('page.wallet'), value: '0x085036c6ec33888db0c4cc8f99791537dbc8ab97' },
            ]}
          />
        </div>

        {/* Trust signal, next to the account details */}
        <div className='border-bege-dark mt-8 flex flex-col items-start gap-4 rounded-xl border bg-white p-6 sm:flex-row sm:items-center'>
          <LuShieldCheck aria-hidden='true' className='text-green size-8 shrink-0' />
          <div className='flex-1'>
            <p className='text-body_semibold'>{t('page.trust_title')}</p>
            <p className='text-sm text-black/70'>{t('page.trust_description')}</p>
          </div>
          <Button asChild variant='outline'>
            <Link href={transformUrl(lng, SITE_GET_URLS.transparency)}>{t('page.trust_cta')}</Link>
          </Button>
        </div>
      </HawkStarsSection>

      <HawkStarsSection spacing='default'>
        <div className='flex flex-col gap-10'>
          <SectionHeader
            align='center'
            eyebrow={t('page.naming_eyebrow')}
            title={t('branding.title')}
          />
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

      <HawkStarsSection spacing='default' className='bg-bege-light'>
        <div className='flex flex-col gap-10 lg:mx-auto lg:w-2/3'>
          <div className='mx-auto flex flex-1 flex-col gap-3'>
            <h3 className='text-h2_bold text-center'>{t('brand.wall_branding.title')}</h3>
            <ImageMedia src={trainingRoom} alt={t('a11y.training_room')} className='rounded-lg' />
            <div className='flex flex-row gap-4'>
              <div className='text-body_semibold text-green flex w-fit flex-row gap-1 rounded-xl p-2 lg:text-base'>
                <ImageMedia
                  src={UserIcon}
                  alt={t('a11y.user')}
                  width={28}
                  height={28}
                  className='my-auto'
                />
                <p className='self-center'>{t('brand.wall_branding.price_solo')}</p>
              </div>
              <div className='text-body_semibold text-green flex w-fit flex-row gap-1 rounded-xl p-2 lg:text-base'>
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

      <HawkStarsSection spacing='default'>
        <SectionHeader align='center' title={t('brand.chairs.title')} className='mb-10' />
        {/* Illustrations are decorative: each card names its chair type in text. */}
        <div className='grid gap-6 md:grid-cols-2'>
          <ChairsSections
            title={t('brand.chairs.types.gaming_chair')}
            price='300€'
            icon={<ImageMedia src={loungeChair} alt='' />}
            size={60}
            currentContributions={loungeChairs}
          />
          <ChairsSections
            title={t('brand.chairs.types.simulation_chair')}
            price='350€'
            icon={<ImageMedia src={simulatorChairTaken} alt='' />}
            size={2}
            currentContributions={simulationChairs}
          />
          <ChairsSections
            title={t('brand.chairs.types.lounge_chair')}
            price='260€'
            icon={<ImageMedia src={standardLoungeChair} alt='' />}
            size={40}
            currentContributions={officeChairs}
          />
          <ChairsSections
            title={t('brand.chairs.types.auditorium_chair')}
            price='200€'
            icon={<ImageMedia src={standardChair} alt='' />}
            size={110}
            currentContributions={auditoriumChairs}
          />
        </div>
      </HawkStarsSection>

      {/* Ink, not green: the alternate dark band, so the page isn't all green blocks */}
      <HawkStarsSection spacing='tight' className='bg-ink text-white'>
        <div className='flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left'>
          <p className='text-h2_bold'>{t('page.store_title')}</p>
          <Button asChild variant='inverse' size='lg'>
            <Link
              href='https://shop.hawkstars.org/'
              lang='en'
              target='_blank'
              rel='noopener noreferrer'
            >
              <LuShoppingBag aria-hidden='true' />
              {t('store')}
            </Link>
          </Button>
        </div>
      </HawkStarsSection>
    </>
  );
};

export default DonatePage;
