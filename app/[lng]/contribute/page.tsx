import Image from 'next/image';
import Link from 'next/link';
import { getServerTranslation } from '@/i18n';
import { LiaUsersSolid, LiaUserSolid } from 'react-icons/lia';
import { PiChairLight } from 'react-icons/pi';
import { TbArmchair } from 'react-icons/tb';
import { TbShoppingCart } from 'react-icons/tb';

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
import LineBreaker from '@/components/utils/LineBreaker/LineBreaker';
import ContributeFormSection from '@/components/contribute/ContributeFormSection';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';
import { client } from '@/lib/sanity/sanityClient';
import { getChairsContributionsQuery } from './queries';
import groupBy from 'lodash.groupby';
import { Contribution } from '@/lib/sanity/sanity.types';

const getChairsContribute = async () => {
  const contributions = await client.fetch(getChairsContributionsQuery);

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
      <h1 className='mx-4 text-center text-green lg:hidden'>{t('contribute_hero')}</h1>
      <HawkStarsSection padding='none'>
        <div className='relative max-w-full max-2xl:mx-0 max-2xl:p-0'>
          <div className='absolute left-40 top-20 hidden text-green lg:block'>
            <h1 className='w-72 text-4xl'>{t('contribute_hero')}</h1>
            <Link
              href='#form'
              lang={lng}
              className='mt-5 flex w-fit flex-row gap-3 rounded-xl bg-green p-4 text-white'
            >
              {t('donate_here')}
            </Link>
          </div>
          <Image src={heroImage} alt='hero image' />
        </div>
      </HawkStarsSection>
      <div className='flex flex-col gap-10 bg-gradient-to-tr from-[#E9E9E9] from-35% via-bege-dark to-[#E9E9E9] to-65% py-16 lg:gap-20 lg:p-20 lg:py-20'>
        <h1 className='mx-4 text-center'>{t('forms_and_modalities')}</h1>
        <div className='flex flex-col gap-10 md:flex-row'>
          <div className='flex flex-col gap-1 md:flex-1'>
            <Image src={bankTransferImage} alt='bank transfer' className='w-full rounded-lg' />
            <h4 className='mt-5 text-xl font-bold'>{t('options.bank_transfer')}</h4>
            <p className='lg:text-justify'>{t('bank_transfer.description')}</p>
            <div className='mt-1 flex flex-col gap-1'>
              <h6>
                IBAN: <span className='font-bold'>PT50.0036.0053.99100203412.98</span>
              </h6>
              <p className='font-bold'>MPIOPTPL</p>
            </div>
          </div>
          <div className='flex flex-col gap-1 md:flex-1'>
            <Image src={cryptoTransferImage} alt='crypto transfer' className='w-full rounded-lg' />
            <h4 className='mt-5 text-xl font-bold'>{t('options.crypto_transfer')}</h4>
            <p className='lg:text-justify'>{t('crypto_transfer.description')}</p>
            <p className='mt-2'>
              Metamask:{' '}
              <span className='break-all font-bold'>
                0x085036c6ec33888db0c4cc8f99791537dbc8ab97
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className='my-5 flex flex-col gap-3'>
        <h1 className='text-center text-green'>{t('other_modalities')}</h1>
        <div className='mt-5 flex flex-col justify-center gap-3'>
          <h3 className='text-center'>{t('store')}</h3>
          <div className='flex justify-center'>
            <Link
              //href='https://shop.hawkstars.org/'
              lang='en'
              href='#'
              target='_blank'
              className='flex w-fit flex-row gap-3 rounded-xl bg-green p-4 text-white'
            >
              <TbShoppingCart className='my-auto' /> Visit Store (Coming Soon)
            </Link>
          </div>
        </div>
        <LineBreaker />
        <HawkStarsSection>
          <div className='flex flex-col gap-3 lg:gap-10'>
            <h1 className='mt-10 text-center text-green'>Branding</h1>

            <div className='flex flex-col gap-10 md:flex-row'>
              <div className='flex flex-1 flex-col gap-3'>
                <h2 className='mx-10 text-center lg:h-14'>
                  {t('brand.international_training_center.title')}
                </h2>
                <Image src={exterior2} alt='training course branding' className='rounded-lg' />
                <h4 className='w-fit rounded-2xl font-bold text-green'>
                  {t('brand.international_training_center.price')}
                </h4>
                <p>{t('brand.international_training_center.description')}</p>
              </div>
              <div className='flex flex-1 flex-col gap-3'>
                <h2 className='mx-10 text-center lg:h-14'>{t('brand.room_branding.title')}</h2>
                <Image src={coworkingRoom} alt='hawk stars training room' className='rounded-lg' />
                <div className='flex flex-col justify-around gap-4'>
                  <h4 className='w-fit rounded-2xl font-bold text-green'>
                    {t('brand.room_branding.price')}
                  </h4>
                  <p>{t('brand.room_branding.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </HawkStarsSection>
        <HawkStarsSection>
          <div className='mt-10 flex flex-col gap-10 lg:mx-auto lg:w-2/3'>
            <div className='mx-auto flex flex-1 flex-col gap-3'>
              <h2 className='text-center'>{t('brand.wall_branding.title')}</h2>
              <Image src={trainingRoom} alt='hawk stars training room' className='rounded-lg' />
              <div className='flex flex-row gap-4'>
                <div className='flex w-fit flex-row gap-1 rounded-2xl p-2 text-sm font-bold text-green lg:text-base'>
                  <LiaUserSolid size={28} className='my-auto' />
                  <p className='self-center'>{t('brand.wall_branding.price_solo')}</p>
                </div>
                <div className='flex w-fit flex-row gap-1 rounded-2xl p-2 text-sm font-bold text-green lg:text-base'>
                  <LiaUsersSolid size={28} />
                  <p className='self-center'>{t('brand.wall_branding.price_company')}</p>
                </div>
              </div>
              <p>{t('brand.wall_branding.description')}</p>
            </div>
          </div>
        </HawkStarsSection>
        <LineBreaker />
        <div>
          <h2 className='text-center text-green'>{t('brand.chairs.title')}</h2>
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
            icon={<Image src={simulatorChairNotTaken} alt='simulator not picked chair' />}
            iconFilled={<Image src={simulatorChairTaken} alt='picked chair' />}
            size={2}
            currentContributions={simulationChairs}
          />

          <ChairsSections
            title={t('brand.chairs.types.lounge_chair')}
            price='260€'
            icon={<TbArmchair size={48} />}
            iconFilled={<TbArmchair size={48} fill='#0A7558' />}
            size={40}
            currentContributions={officeChairs}
          />
          <ChairsSections
            title={t('brand.chairs.types.auditorium_chair')}
            price='230€'
            icon={<PiChairLight size={48} />}
            iconFilled={<PiChairLight size={48} fill='#0A7558' />}
            size={110}
            currentContributions={auditoriumChairs}
          />
        </div>
      </div>
      <section className='bg-bege-light py-10' id='form'>
        <h2 className='flex justify-center text-green'>{t('helps_us_donate')}</h2>
        <ContributeFormSection lng={lng} />
      </section>
    </div>
  );
};

export default DonatePage;
