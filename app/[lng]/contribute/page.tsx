import Image from 'next/image';
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

import LineBreaker from '@/components/utils/LineBreaker/LineBreaker';
import ContributeFormSection from '@/components/contribute/ContributeFormSection';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';

import groupBy from 'lodash.groupby';
import BrandingSection from '@/components/contribute/BrandingSection';
import { Contribution } from '@/payload-types';
import { getChairsContributionsQuery } from '@/lib/payload/queries/contribution';

const getChairsContribute = async () => {
  const contributions = await getChairsContributionsQuery();

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

const DonatePage = async (props: { params: Promise<{ lng: Language }> }) => {
  const params = await props.params;
  const { lng } = params;

  const { t } = await getServerTranslation(lng, 'contribute');
  const { simulationChairs, officeChairs, auditoriumChairs, loungeChairs } =
    await getChairsContribute();

  return (
    <div className='mt-5 flex flex-col gap-5 lg:mt-10'>
      <h1 className='text-h2_bold text-green mx-4 text-center lg:hidden'>{t('contribute_hero')}</h1>
      <HawkStarsSection padding='none'>
        <div className='relative max-w-full max-2xl:mx-0 max-2xl:p-0'>
          <div className='text-green absolute top-20 left-40 hidden lg:block'>
            <h1 className='text-h1_semibold w-72'>{t('contribute_hero')}</h1>
            <Link
              href='#form'
              lang={lng}
              className='text-body_semibold bg-green mt-5 flex w-fit flex-row gap-3 rounded-xl p-4 text-white'
            >
              {t('donate_here')}
            </Link>
          </div>
          <Image src={heroImage} alt='hero image' />
        </div>
      </HawkStarsSection>
      <div className='via-bege-dark flex flex-col gap-10 bg-linear-to-tr from-[#E9E9E9] from-35% to-[#E9E9E9] to-65% py-16 lg:gap-20 lg:p-20 lg:py-20'>
        <h2 className='text-h2_light mx-4 text-center'>{t('forms_and_modalities')}</h2>
        <div className='mx-auto flex max-w-6xl flex-col gap-10 max-lg:px-4 md:flex-row'>
          <div className='flex flex-col gap-1 md:flex-1'>
            <Image src={bankTransferImage} alt='bank transfer' className='w-full rounded-lg' />
            <h4 className='text-body_semibold mt-5'>{t('options.bank_transfer')}</h4>
            <p className='text-body_regular lg:text-justify'>{t('bank_transfer.description')}</p>
            <div className='text-body_regular mt-1 flex flex-col gap-1 font-bold'>
              <h6>
                IBAN: <span className=''>PT50.0036.0053.99100203412.98</span>
              </h6>
              <p className='text-body_regular font-bold'>MPIOPTPL</p>
            </div>
          </div>
          <div className='flex flex-col gap-1 md:flex-1'>
            <Image src={cryptoTransferImage} alt='crypto transfer' className='w-full rounded-lg' />
            <h4 className='text-body_semibold mt-5'>{t('options.crypto_transfer')}</h4>
            <p className='text-body_regular lg:text-justify'>{t('crypto_transfer.description')}</p>
            <p className='text-body_regular mt-2 font-bold'>
              Metamask:{' '}
              <span className='text-body_regular font-bold break-all'>
                0x085036c6ec33888db0c4cc8f99791537dbc8ab97
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className='my-5 flex flex-col gap-3'>
        <h2 className='text-h2_light text-green text-center'>{t('other_modalities')}</h2>
        <div className='mt-5 flex flex-col justify-center gap-3'>
          <div className='flex justify-center'>
            <Link
              href='https://shop.hawkstars.org/'
              lang='en'
              target='_blank'
              className='bg-green flex w-fit flex-row gap-3 rounded-xl p-4 text-white'
            >
              <Image
                src={ShoppingCardIcon}
                alt='Shopping Cart'
                width={20}
                height={20}
                className='my-auto'
              />{' '}
              {t('store')}
            </Link>
          </div>
        </div>
        <LineBreaker />
        <HawkStarsSection>
          <div className='flex flex-col gap-3 lg:gap-10'>
            <h2 className='text-h2_bold text-green mt-10 text-center'>Branding</h2>

            <div className='mx-auto flex max-w-6xl flex-col gap-10 md:flex-row'>
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
          </div>
        </HawkStarsSection>
        <HawkStarsSection>
          <div className='mt-10 flex flex-col gap-10 lg:mx-auto lg:w-2/3'>
            <div className='mx-auto flex flex-1 flex-col gap-3'>
              <h3 className='text-h2_light text-center'>{t('brand.wall_branding.title')}</h3>
              <Image src={trainingRoom} alt='hawk stars training room' className='rounded-lg' />
              <div className='flex flex-row gap-4'>
                <div className='text-body_semibold text-green flex w-fit flex-row gap-1 rounded-2xl p-2 lg:text-base'>
                  <Image src={UserIcon} alt='User' width={28} height={28} className='my-auto' />
                  <p className='self-center'>{t('brand.wall_branding.price_solo')}</p>
                </div>
                <div className='text-body_semibold text-green flex w-fit flex-row gap-1 rounded-2xl p-2 lg:text-base'>
                  <Image
                    src={CompanyIcon}
                    alt='Company'
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
        <LineBreaker />
        <div>
          <h3 className='text-h2_bold text-green text-center'>{t('brand.chairs.title')}</h3>
          <ChairsSections
            title={t('brand.chairs.types.gaming_chair')}
            price='300€'
            icon={<Image src={loungeChairEmpty} alt='gaming/office chair not taken' />}
            iconFilled={<Image src={loungeChair} alt='gaming/office chair filled' />}
            size={60}
            currentContributions={loungeChairs}
          />
          <ChairsSections
            title={t('brand.chairs.types.simulation_chair')}
            price='350€'
            icon={
              <Image
                src={simulatorChairNotTaken}
                alt='Simulator chair representing chairs that have no donor attached to'
              />
            }
            iconFilled={
              <Image
                src={simulatorChairTaken}
                alt='Simulator chair representing chairs that have a donor attached to'
              />
            }
            size={2}
            currentContributions={simulationChairs}
          />

          <ChairsSections
            title={t('brand.chairs.types.lounge_chair')}
            price='260€'
            icon={
              <Image
                src={standardLoungeChair}
                className='h-12 w-12'
                alt='Simulator chair representing chairs that have a donor attached to'
              />
            }
            iconFilled={
              <Image
                src={standardLoungeChair}
                className='fill-green h-12 w-12'
                alt='Simulator chair representing chairs that have a donor attached to'
              />
            }
            size={40}
            currentContributions={officeChairs}
          />
          <ChairsSections
            title={t('brand.chairs.types.auditorium_chair')}
            price='200€'
            icon={
              <Image
                src={standardChair}
                className='h-12 w-12'
                alt='Simulator chair representing chairs that have a donor attached to'
              />
            }
            iconFilled={
              <Image
                src={standardChair}
                className='fill-green h-12 w-12'
                alt='Simulator chair representing chairs that have a donor attached to'
              />
            }
            size={110}
            currentContributions={auditoriumChairs}
          />
        </div>
      </div>
      <section className='bg-bege-light py-10' id='form'>
        <h3 className='text-h2_bold text-green flex justify-center'>{t('helps_us_donate')}</h3>
        <ContributeFormSection lng={lng} />
      </section>
    </div>
  );
};

export default DonatePage;
