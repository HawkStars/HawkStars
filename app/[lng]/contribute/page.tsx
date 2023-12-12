import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { LiaUsersSolid, LiaUserSolid } from 'react-icons/lia';
import { PiChairLight } from 'react-icons/pi';
import { TbArmchair } from 'react-icons/tb';
import groupBy from 'lodash.groupby';

import ChairsSections from '@/components/contribute/ChairsSection';

// images
import heroImage from '@/public/images/contribute/hero.jpg';
import bankTransferImage from '@/public/images/contribute/bank_transfer.png';
import cryptoTransferImage from '@/public/images/contribute/crypto_transfer.png';
import exterior2 from '@/public/images/training_center/exterior2.jpg';
import trainingRoom from '@/public/images/training_center/meeting_1.jpg';

// chairs
import simulatorChairNotTaken from '@/public/images/icons/contribute/simulator-empty.svg';
import simulatorChairTaken from '@/public/images/icons/contribute/simulator-fill.svg';
import loungeChairEmpty from '@/public/images/icons/contribute/lounge-empty.svg';
import loungeChair from '@/public/images/icons/contribute/lounge-fill.svg';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { Contribution } from '@/models/database';
import LineBreaker from '@/components/utils/LineBreaker/LineBreaker';

const getChairsContribute = async () => {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from<'contributions', Contribution>('contributions')
    .select();

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
  const officeChairs: Contribution[] = contributions[
    'OFFICE_CHAIR'
  ] as unknown as Contribution[];
  const auditoriumChairs: Contribution[] = contributions[
    'AUDITORIUM_CHAIR'
  ] as unknown as Contribution[];
  const loungeChairs: Contribution[] = contributions[
    'LOUNGE_CHAIR'
  ] as unknown as Contribution[];

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
      <h2 className='text-center text-green lg:hidden'>
        {t('contribute_hero')}
      </h2>
      <div className='relative'>
        <h2 className='absolute left-40 top-20 hidden w-72 text-4xl text-green lg:block'>
          {t('contribute_hero')}
        </h2>
        <Image src={heroImage} alt='hero image' />
      </div>
      <div className='flex flex-col gap-10 bg-gradient-to-tr from-[#E9E9E9] from-35% via-bege-dark to-[#E9E9E9] to-65% py-16 lg:gap-20 lg:p-20 lg:py-20'>
        <h3 className='text-center'>Formas e modalidades de doação</h3>
        <div className='container-hawk flex flex-col gap-10 md:flex-row lg:mx-5'>
          <div className='flex flex-col gap-1 md:flex-1'>
            <Image
              src={bankTransferImage}
              alt='bank transfer'
              className='w-full rounded-lg'
            />
            <h4 className='mt-5 font-bold'>{t('bank_transfer.title')}</h4>
            <p className='text-justify'>{t('bank_transfer.description')}</p>
          </div>
          <div className='flex flex-col gap-1 md:flex-1'>
            <Image
              src={cryptoTransferImage}
              alt='crypto transfer'
              className='w-full rounded-lg'
            />
            <h4 className='mt-5 font-bold'>{t('crypto_transfer.title')}</h4>
            <p className='text-justify'>{t('crypto_transfer.description')}</p>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        <h2 className='text-center text-green'>{t('other_modalities')}</h2>

        <div className='flex flex-col gap-10'>
          <h1 className='mt-10 text-center text-green'>Branding</h1>
          <div className='container-hawk flex flex-col gap-10 md:flex-row'>
            <div className='flex flex-1 flex-col gap-3'>
              <h2 className='text-center'>TRAINING COURSE BRANDING</h2>
              <Image
                src={exterior2}
                alt='training course branding'
                className='rounded-lg'
              />
              <h4 className='w-fit rounded-2xl border border-green p-2 text-green'>
                from 380.000€
              </h4>
              <p>
                Parcerias financeiras do Naming do Internacional Training Center
                - negociável (Por exemplo - International Training Center)
              </p>
            </div>
            <div className='flex flex-1 flex-col gap-3'>
              <h2 className='text-center'>ROOM BRANDING</h2>
              <Image
                src={trainingRoom}
                alt='hawk stars training room'
                className='rounded-lg'
              />
              <div className='flex flex-col justify-around gap-4'>
                <h4 className='w-fit rounded-2xl border border-green p-2 text-green'>
                  From 15.000€
                </h4>
                <p>
                  Parcerias financeiras de Naming Room para Salas de Formação,
                  Reuniões, Co-working, Lounge, Gaming Hub, Estúdio de Gravação.
                </p>
              </div>
            </div>
          </div>
        </div>
        <LineBreaker />
        <div>
          <div className='flex flex-row gap-3'>
            <LiaUserSolid size={28} className='my-auto' />
            <p className='self-center'>From 500€ Solo</p>
          </div>
          <div className='flex flex-row gap-3'>
            <LiaUsersSolid size={28} />
            <p>From 1800€ Community/Company</p>
          </div>
        </div>
        <h2 className='text-center text-green'>
          Nome em Cadeiras do Training Center
        </h2>
        <ChairsSections
          title='Cadeira de Escritório/Gaming'
          price='300€'
          icon={
            <Image src={loungeChairEmpty} alt='gaming/office chair not taken' />
          }
          iconFilled={
            <Image src={loungeChair} alt='gaming/office chair filled' />
          }
          size={60}
          currentContributions={loungeChairs}
        />
        <ChairsSections
          title='Cadeira de Drive Simulator Gaming'
          price='350€'
          icon={
            <Image
              src={simulatorChairNotTaken}
              alt='simulator not picked chair'
            />
          }
          iconFilled={<Image src={simulatorChairTaken} alt='picked chair' />}
          size={2}
          currentContributions={simulationChairs}
        />

        <ChairsSections
          title='Cadeira Lounge Co(ffe) Working'
          price='260€'
          icon={<TbArmchair size={48} />}
          iconFilled={<TbArmchair size={48} fill='#0A7558' />}
          size={40}
          currentContributions={officeChairs}
        />
        <ChairsSections
          title='Cadeira Móvel de Auditório/Salas Formação'
          price='230€'
          icon={<PiChairLight size={48} />}
          iconFilled={<PiChairLight size={48} fill='#0A7558' />}
          size={110}
          currentContributions={auditoriumChairs}
        />
        <LineBreaker />
        <div className='flex flex-col justify-center gap-3'>
          <h3 className='text-center'>HawkStars Store</h3>
          <div className='flex justify-center'>
            <Link
              href='https://shop.hawkstars.org/'
              target='_blank'
              className='w-fit rounded-xl bg-green p-4 text-white'
            >
              Visit Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
