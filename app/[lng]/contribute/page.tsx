import LineBreaker from '@/components/utils/LineBreaker/LineBreaker';
import { useTranslation } from '@/i18n';
import { IconType } from 'react-icons';
import { LiaUsersSolid, LiaUserSolid } from 'react-icons/lia';
import { PiOfficeChairBold } from 'react-icons/pi';
import Image from 'next/image';

// images
import heroImage from '@/public/images/contribute/hero.jpg';
import bankTransferImage from '@/public/images/contribute/bank_transfer.png';
import cryptoTransferImage from '@/public/images/contribute/crypto_transfer.png';

// chairs

import simulatorChairNotTaken from '@/public/images/icons/contribute/simulator-empty.svg';
import simulatorChairTaken from '@/public/images/icons/contribute/simulator-fill.svg';

import loungeChair from '@/public/images/icons/contribute/lounge-fill.svg';

const DonatePage = async ({ params: { lng } }: { params: { lng: string } }) => {
  const { t } = await useTranslation(lng, 'contribute');
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

        <div className='my-10 flex flex-col justify-center gap-3'>
          <h3 className='text-center'>Nome em Cadeiras do Training Center</h3>
          <h4 className='text-center'>Cadeira de Escritório/Gaming</h4>
          <div className='mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-5'>
            {Array(30)
              .fill('a')
              .map((item) => {
                console.log(item);
                return <Image src={loungeChair} alt='test chair' key={item} />;
              })}
          </div>
        </div>

        <div className='my-10 flex flex-col justify-center gap-3'>
          <h3 className='text-center'>Cadeira de Drive Simulator Gaming</h3>
          <div className='flex justify-center gap-5'>
            <div className='group'>
              <Image src={simulatorChairTaken} alt='picked chair' />
              <div className='absolute hidden w-fit bg-bege-dark p-2 text-sm group-hover:block'>
                Paulo Cardoso
              </div>
            </div>
            <Image
              src={simulatorChairNotTaken}
              alt='simulator not picked chair'
            />
          </div>
        </div>

        <div className='my-10 flex flex-col justify-center gap-3'>
          <h3 className='text-center'>Training Chair</h3>
          <div className='flex justify-center gap-5'>
            <div className='group relative'>
              <Image src={simulatorChairTaken} alt='picked chair' />
            </div>
            <Image
              src={simulatorChairNotTaken}
              alt='simulator not picked chair'
            />
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <h3>TRAINING COURSE BUILDING BRANDING</h3>
          <h4>from 380000€</h4>
          <p>
            Parcerias financeiras do Naming do Internacional Training Center -
            negociável (Por exemplo - International Training Center;
          </p>
        </div>
        <LineBreaker />
        <div className='flex flex-col gap-3'>
          <h3>TRAINING COURSE ROOM BRANDING</h3>
          <h4>from 15000€</h4>
          <p>
            Parcerias financeiras de Naming Room para Salas de Formação,
            Reuniões, Co-working, Lounge, Gaming Hub, Estúdio de Gravação
          </p>
        </div>
        <LineBreaker />
        <div className='flex flex-col gap-10'>
          <h3>NOME NA PAREDE</h3>
          <div className='flex flex-row justify-around gap-4'>
            <div className='flex flex-col gap-2'>
              <h2>From 500€ Solo</h2>
              <LiaUserSolid size={62} className='mx-auto' />
            </div>
            <div className='flex flex-col gap-2'>
              <h2>From 1800€ Community/Company</h2>
              <LiaUsersSolid size={62} className='mx-auto' />
            </div>
          </div>
        </div>
        <LineBreaker />
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-4'>
            <h3>Office Chair</h3>
            <div className='flex flex-row gap-3'>
              <TakenCommoditySection icon={PiOfficeChairBold} />
            </div>
          </div>
          <div>
            <h3>Lounge Coffee /Working</h3>
            <div></div>
          </div>
          <div>
            <h3>Regular Chairs</h3>
            <div></div>
          </div>
        </div>
        <LineBreaker />
        <div>Wall Naming</div>
      </div>
    </div>
  );
};

export default DonatePage;

type TakenCommoditySectionProps = {
  icon: IconType;
};

const TakenCommoditySection = ({ icon }: TakenCommoditySectionProps) => {
  return (
    <div className='flex flex-row gap-5 p-2'>
      <div>
        <div className='flex flex-col'>
          {icon({ size: 32, fill: 'green', className: 'mx-auto' })}
        </div>
        <p className='mt-2 text-sm'>Taken</p>
      </div>
      <div>
        <div className='flex flex-col'>
          {icon({ size: 32, className: 'mx-auto' })}
        </div>
        <p className='mt-2 text-sm'>Not Taken</p>
      </div>
    </div>
  );
};
