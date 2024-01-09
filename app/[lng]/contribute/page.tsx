import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { LiaUsersSolid, LiaUserSolid } from 'react-icons/lia';
import { PiChairLight } from 'react-icons/pi';
import { TbArmchair } from 'react-icons/tb';
import { TbShoppingCart } from 'react-icons/tb';
import groupBy from 'lodash.groupby';

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
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { Contribution } from '@/models/database';
import LineBreaker from '@/components/utils/LineBreaker/LineBreaker';
import { Suspense } from 'react';
import MainHawkStarsLoading from '../loading';
import ContributeFormSection from '@/components/contribute/ContributeFormSecction';

const getChairsContribute = async () => {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from<'contributions', Contribution>('contributions')
    .select()
    .not('confirmed_by', 'is', null);

  if (error || !data)
    return {
      simulationChairs: [],
      officeChairs: [],
      auditoriumChairs: [],
      loungeChairs: [],
    };

  const contributions = groupBy(data, 'type');
  const simulationChairs: Contribution[] = contributions[
    'SIMULATOR_CHAIR'
  ] as unknown as Contribution[];
  const officeChairs: Contribution[] = contributions['OFFICE_CHAIR'] as unknown as Contribution[];
  const auditoriumChairs: Contribution[] = contributions[
    'AUDITORIUM_CHAIR'
  ] as unknown as Contribution[];
  const loungeChairs: Contribution[] = contributions['LOUNGE_CHAIR'] as unknown as Contribution[];

  return {
    simulationChairs,
    officeChairs,
    auditoriumChairs,
    loungeChairs,
  };
};

const DonatePage = async ({ params: { lng } }: { params: { lng: string } }) => {
  const { t } = await useTranslation(lng, 'contribute');
  const { simulationChairs, officeChairs, auditoriumChairs, loungeChairs } =
    await getChairsContribute();

  return (
    <div className='mt-5 flex flex-col gap-5 lg:mt-10'>
      <h2 className='text-center text-green lg:hidden'>{t('contribute_hero')}</h2>
      <div className='layout-section relative max-w-full max-2xl:mx-0 max-2xl:p-0'>
        <div className='absolute left-40 top-20 hidden text-green lg:block'>
          <h2 className='w-72 text-4xl'>{t('contribute_hero')}</h2>
          <Link
            href='#form'
            className='mt-5 flex w-fit flex-row gap-3 rounded-xl bg-green p-4 text-white'
          >
            {t('donate_here')}
          </Link>
        </div>
        <Image src={heroImage} alt='hero image' />
      </div>
      <div className='flex flex-col gap-10 bg-gradient-to-tr from-[#E9E9E9] from-35% via-bege-dark to-[#E9E9E9] to-65% py-16 lg:gap-20 lg:p-20 lg:py-20'>
        <h3 className='text-center'>{t('forms_and_modalities')}</h3>
        <div className='layout-section flex flex-col gap-10 md:flex-row'>
          <div className='flex flex-col gap-1 md:flex-1'>
            <Image src={bankTransferImage} alt='bank transfer' className='w-full rounded-lg' />
            <h4 className='mt-5 text-xl font-bold'>{t('options.bank_transfer')}</h4>
            <p className='text-justify'>{t('bank_transfer.description')}</p>
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
            <p className='text-justify'>{t('crypto_transfer.description')}</p>
            <p className='mt-2'>
              Metamask:{' '}
              <span className='font-bold'>0x085036c6ec33888db0c4cc8f99791537dbc8ab97</span>
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
              href='#'
              target='_blank'
              className='flex w-fit flex-row gap-3 rounded-xl bg-green p-4 text-white'
            >
              <TbShoppingCart className='my-auto' /> Visit Store (Coming Soon)
            </Link>
          </div>
        </div>
        <LineBreaker />
        <div className='flex flex-col gap-10'>
          <h1 className='mt-10 text-center text-green'>Branding</h1>
          <div className='layout-section flex flex-col gap-10 md:flex-row'>
            <div className='flex flex-1 flex-col gap-3'>
              <h2 className='mx-10 h-14 text-center'>
                {t('brand.international_training_center.title')}
              </h2>
              <Image src={exterior2} alt='training course branding' className='rounded-lg' />
              <h4 className='w-fit rounded-2xl border border-green p-2 text-green'>
                {t('brand.international_training_center.price')}
              </h4>
              <p>{t('brand.international_training_center.description')}</p>
            </div>
            <div className='flex flex-1 flex-col gap-3'>
              <h2 className='mx-10 h-14 text-center'>{t('brand.room_branding.title')}</h2>
              <Image src={coworkingRoom} alt='hawk stars training room' className='rounded-lg' />
              <div className='flex flex-col justify-around gap-4'>
                <h4 className='w-fit rounded-2xl border border-green p-2 text-green'>
                  {t('brand.room_branding.price')}
                </h4>
                <p>{t('brand.room_branding.description')}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='layout-section mt-10 flex flex-col gap-10 lg:mx-auto lg:w-2/3'>
          <div className='mx-auto flex flex-1 flex-col gap-3 '>
            <h2 className='text-center'>{t('brand.wall_branding.title')}</h2>
            <Image src={trainingRoom} alt='hawk stars training room' className='rounded-lg' />
            <div className='flex flex-row gap-4'>
              <div className='flex w-fit flex-row gap-1 rounded-2xl border border-green p-2 text-sm text-green lg:text-base'>
                <LiaUserSolid size={28} className='my-auto' />
                <p className='self-center'>{t('brand.wall_branding.price_solo')}</p>
              </div>
              <div className='flex w-fit flex-row gap-1 rounded-2xl border border-green p-2 text-sm text-green lg:text-base'>
                <LiaUsersSolid size={28} />
                <p className='self-center'>{t('brand.wall_branding.price_company')}</p>
              </div>
            </div>
            <p>{t('brand.wall_branding.description')}</p>
          </div>
        </div>
        <LineBreaker />
        <div className='layout-section'>
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
        <Suspense fallback={<MainHawkStarsLoading />}>
          <ContributeFormSection lng={lng} />
        </Suspense>
      </section>
    </div>
  );
};

export default DonatePage;
