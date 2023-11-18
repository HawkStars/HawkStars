import { LanguageProps } from '@/components/types';
import Image from 'next/image';

/**
 * Images
 *
 */
import trainingCenterExterior from '@/public/images/training_center/exterior.jpg';

// Entrada e recepção
import entradaRececao1 from '@/public/images/training_center/entry_1.jpg';
import entradaRececao2 from '@/public/images/training_center/entry_2.jpg';
import entradaRececao3 from '@/public/images/training_center/entry_3.jpg';
import entradaRececao4 from '@/public/images/training_center/entry_4.jpg';
import entradaRececao5 from '@/public/images/training_center/entry_5.jpg';

// floors training center
import trainingCenterFloor0 from '@/public/images/training_center/piso_0.jpg';
import trainingCenterFloor1 from '@/public/images/training_center/piso_1.jpg';
import trainingCenterFloor2 from '@/public/images/training_center/piso_2.jpg';

// meeting rooms
import meetingRoom1 from '@/public/images/training_center/meeting_1.jpg';
import meetingRoom2 from '@/public/images/training_center/meeting_2.jpg';
import meetingRoom3 from '@/public/images/training_center/meeting_3.jpg';

const GlobalVillageArquitecture = ({ lng }: LanguageProps) => {
  return (
    <section
      id='arquitecture'
      className='mx-10 mb-10 flex max-w-6xl flex-col gap-20 lg:mx-auto'
    >
      <div>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          International Training Center
        </h1>
        <h2 className='flex justify-center text-xl text-green'>
          Visão Exterior Atual
        </h2>
        {/* 2 imagens */}
      </div>
      <div className='flex flex-col gap-4'>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          Visão Exterior Futura
        </h1>
        <div className='flex flex-row justify-center gap-4'>
          <div className='w-1/2'>
            <Image
              src={trainingCenterExterior}
              alt={'planta side'}
              className='flex-1 rounded-xl'
              sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
              loading='lazy'
            />
          </div>
          <Image
            src={trainingCenterExterior}
            alt={'planta side'}
            className='flex-1 rounded-xl'
            loading='lazy'
          />
        </div>

        <div className='relative'>
          <Image
            className='rounded-3xl'
            src={'/images/training_center/01.jpg'}
            alt={'organization exterior side'}
            sizes='(max-width: 768px) 50px, (max-width: 1200px) 150px, 300px'
            loading='lazy'
            style={{ objectFit: 'scale-down', maxWidth: '300px' }}
            fill
          />
        </div>
        <div>
          <Image
            className='rounded-3xl'
            alt='planta_xray'
            src={'/images/training_center/planta_side.jpg'}
            style={{ objectFit: 'contain' }}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px'
            height={3000}
            width={3000}
          />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          Entrada/Receção
        </h1>
        <div className='flex flex-col gap-3'>
          <Image
            className='rounded-3xl'
            alt='planta_xray'
            src={entradaRececao1}
            style={{ objectFit: 'contain' }}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px'
          />
          <Image
            className='rounded-3xl'
            alt='planta_xray'
            src={entradaRececao2}
            style={{ objectFit: 'contain' }}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px'
          />
          <Image
            className='rounded-3xl'
            alt='planta_xray'
            src={entradaRececao3}
            style={{ objectFit: 'contain' }}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px'
          />
        </div>
        <div className='flex h-[700px] flex-row gap-2'>
          <Image
            className='flex-1 rounded-3xl'
            alt='planta_xray'
            src={entradaRececao4}
            style={{ objectFit: 'cover' }}
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 40vw, 33vw'
          />
          <Image
            className='flex-1 rounded-3xl'
            alt='planta_xray'
            src={entradaRececao5}
            style={{ objectFit: 'cover' }}
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 40vw, 33vw'
          />
        </div>
      </div>
      <div>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          Salas de Formação e Salas de Reuniões
        </h1>
        <div className='flex flex-col gap-2'>
          <Image
            className='flex-1 rounded-3xl'
            alt='planta_xray'
            src={meetingRoom1}
            style={{ objectFit: 'contain' }}
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
          />
          <Image
            className='ml-auto w-3/4 flex-1 rounded-3xl'
            alt='planta_xray'
            src={meetingRoom2}
            style={{ objectFit: 'contain' }}
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
          />
          <Image
            className='mr-auto w-3/4 flex-1 rounded-3xl'
            alt='planta_xray'
            src={meetingRoom3}
            style={{ objectFit: 'contain' }}
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </div>
      {/* */}
      <div className='flex flex-col gap-4'>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          Salas de Lounge e Co-working
        </h1>
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
        />{' '}
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
        />{' '}
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
        />{' '}
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
        />{' '}
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
        />{' '}
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
        />{' '}
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
        />{' '}
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
        />{' '}
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
        />{' '}
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/coworking_10.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
        />
        <div className='flex flex-row gap-4'>
          <Image
            className='mr-auto flex-1 rounded-3xl'
            alt='planta_xray'
            src={'/images/training_center/coworking_11.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
          />
          <Image
            className='mr-auto flex-1 rounded-3xl'
            alt='planta_xray'
            src={'/images/training_center/coworking_12.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </div>
      {/* */}
      <div>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          Salas Tecnologica - Gaming Hub
        </h1>

        {/* missing image*/}
      </div>
      <div>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          Estúdio de Gravação
        </h1>
      </div>
      <div className='flex flex-col gap-1'>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          Vista Aerea 2D
        </h1>
        <h2 className='flex justify-center text-xl text-green'>Piso 2</h2>
        <div className='flex justify-center rounded-xl bg-bege-dark p-4'>
          <Image
            className='rounded-3xl'
            alt='piso_2'
            src={trainingCenterFloor2}
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <h2 className='flex justify-center text-xl text-green'>Piso 1</h2>
        <div className='flex justify-center rounded-3xl bg-bege-dark p-4'>
          <Image
            className='rounded-3xl'
            alt='piso_2'
            src={trainingCenterFloor1}
            style={{ objectFit: 'cover' }}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <h2 className='flex justify-center text-xl text-green'>Piso 0</h2>
        <div className='flex justify-center rounded-3xl bg-bege-dark p-4'>
          <Image
            alt='piso_2'
            src={trainingCenterFloor0}
            style={{ objectFit: 'cover' }}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </div>
    </section>
  );
};

export default GlobalVillageArquitecture;
