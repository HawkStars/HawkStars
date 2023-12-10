import Image from 'next/image';
import { useTranslation } from '@/i18n';
import { LiaUsersSolid, LiaUserSolid } from 'react-icons/lia';
import { PiChairLight } from "react-icons/pi";
import { TbArmchair } from "react-icons/tb";


// images
import heroImage from '@/public/images/contribute/hero.jpg';
import bankTransferImage from '@/public/images/contribute/bank_transfer.png';
import cryptoTransferImage from '@/public/images/contribute/crypto_transfer.png';

// chairs

import simulatorChairNotTaken from '@/public/images/icons/contribute/simulator-empty.svg';
import simulatorChairTaken from '@/public/images/icons/contribute/simulator-fill.svg';

import loungeChair from '@/public/images/icons/contribute/lounge-fill.svg';
import Link from 'next/link';
import ChairsSections from '@/components/contribute/ChairsSection';

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


        <div className=''>
          <h2 className='text-center text-green'>Branding</h2>
          <h3 className='text-center'>TRAINING COURSE BUILDING BRANDING</h3>
          <h4>from 380000€</h4>
          <p>
            Parcerias financeiras do Naming do Internacional Training Center -
            negociável (Por exemplo - International Training Center;
          </p>
        </div>
        <div className='flex flex-col gap-3'>
          <h3>TRAINING COURSE ROOM BRANDING</h3>
          <h4>from 15000€</h4>
          <p>
            Parcerias financeiras de Naming Room para Salas de Formação,
            Reuniões, Co-working, Lounge, Gaming Hub, Estúdio de Gravação
          </p>
        </div>
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
        <ChairsSections title='Nome em Cadeiras do Training Center' subtitle='Cadeira de Escritório/Gaming (300€)' icon={undefined} iconFilled={<Image src={loungeChair} alt='gaming/office chair filled' />} size={60} />
        <ChairsSections title='Cadeira de Drive Simulator Gaming' icon={<Image
              src={simulatorChairNotTaken}
              alt='simulator not picked chair'
            />} iconFilled={<Image src={simulatorChairTaken} alt='picked chair' />} size={2} />
        
        <ChairsSections title="Cadeira Lounge Co(ffe) Working" icon={<TbArmchair size={48}/>} iconFilled={<TbArmchair size={48} fill='#0A7558' />}  size={40}/>
        <ChairsSections title="Cadeira Móvel de Auditório/Salas Formação" icon={<PiChairLight size={48} />} iconFilled={ <PiChairLight size={48} fill="#0A7558"/>} size={110} />
        <div className='flex justify-center gap-3 flex-col'>
          <h3 className='text-center'>HawkStars Store</h3>
          <div className='flex justify-center'>
          <Link href="https://shop.hawkstars.org/" target="_blank" className='p-4 text-white bg-green rounded-xl w-fit'>
              Visit Store
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;

