import { useTranslation } from '../../../i18n';
import Image from 'next/image';

const GlobalVillageArquitecture = () => {
  return (
    <section
      id='arquitecture'
      className='mx-10 mb-10 flex flex-col gap-20 lg:mx-20'
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
          <Image
            src={'/images/training_center/exterior.jpg'}
            alt={'planta side'}
            width={1920}
            height={1080}
            className='flex-1 rounded-xl'
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
          />
          <Image
            src={'/images/training_center/exterior.jpg'}
            alt={'planta side'}
            width={542}
            height={653}
            className='flex-1 rounded-xl'
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>

        <div>
          <Image
            className='rounded-3xl'
            src={'/images/training_center/exterior.jpg'}
            alt={'organization exterior side'}
            width={1920}
            height={1080}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px'
          />
        </div>
        <div>
          <Image
            className='rounded-3xl'
            alt='planta_xray'
            src={'/images/training_center/planta_side.jpg'}
            style={{ objectFit: 'contain' }}
            height={5000}
            width={2771}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px'
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
            src={'/images/training_center/entry_1.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px'
          />
          <Image
            className='rounded-3xl'
            alt='planta_xray'
            src={'/images/training_center/entry_2.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px'
          />
          <Image
            className='rounded-3xl'
            alt='planta_xray'
            src={'/images/training_center/entry_3.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px'
          />
          <Image
            className='rounded-3xl'
            alt='planta_xray'
            src={'/images/training_center/entry_4.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px'
          />
        </div>
        <div className='flex flex-row gap-2'>
          <Image
            className='flex-1 rounded-3xl'
            alt='planta_xray'
            src={'/images/training_center/entry_5.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 40vw, 33vw'
          />
          <Image
            className='flex-1 rounded-3xl'
            alt='planta_xray'
            src={'/images/training_center/entry_6.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
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
            src={'/images/training_center/meeting_1.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
          />
          <Image
            className='ml-auto w-3/4 flex-1 rounded-3xl'
            alt='planta_xray'
            src={'/images/training_center/meeting_2.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
          />
          <Image
            className='mr-auto w-3/4 flex-1 rounded-3xl '
            alt='planta_xray'
            src={'/images/training_center/meeting_3.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </div>
      {/* */}
      <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
        Salas de Lounge e Co-working
      </h1>
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

        {/* missing image*/}
      </div>
      <div className='flex flex-col gap-1'>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          Vista Aerea 3D
        </h1>
        <h2 className='flex justify-center text-xl text-green'>Piso 2</h2>
        <div className='flex justify-center rounded-xl bg-bege-dark p-4'>
          <Image
            className='rounded-3xl'
            alt='piso_2'
            src={'/images/training_center/piso_2.jpg'}
            height={1920}
            width={1080}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <h2 className='flex justify-center text-xl text-green'>Piso 1</h2>
        <div className='flex justify-center rounded-3xl bg-bege-dark p-4'>
          <Image
            className='rounded-3xl '
            alt='piso_2'
            src={'/images/training_center/piso_1.jpg'}
            height={1920}
            width={1080}
            style={{ objectFit: 'contain' }}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <h2 className='flex justify-center text-xl text-green'>Piso 0</h2>
        <div className='flex justify-center rounded-3xl bg-bege-dark p-4'>
          <Image
            alt='piso_2'
            src={'/images/training_center/piso_0.jpg'}
            height={1920}
            width={1080}
            style={{ objectFit: 'contain' }}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </div>
    </section>
  );
};

export default GlobalVillageArquitecture;
