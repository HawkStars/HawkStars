import { LanguageProps } from '@/components/types';
import Image from 'next/image';
import { useTranslation } from '@/i18n';

/**
 * Images
 *
 */

// Aereal
import aereal1 from '@/public/images/training_center/aereal1.jpg';
import aereal2 from '@/public/images/training_center/aereal2.jpg';

// outside view
import exterior1 from '@/public/images/training_center/exterior1.jpg';
import exterior2 from '@/public/images/training_center/exterior2.jpg';
import trainingCenterExterior from '@/public/images/training_center/exterior.jpg';
import plantaExterior from '@/public/images/training_center/planta_side.jpg';

// Entrada e recepção
import entradaRececao1 from '@/public/images/training_center/entry_1.jpg';
import entradaRececao2 from '@/public/images/training_center/entry_2.jpg';
import entradaRececao3 from '@/public/images/training_center/entry_3.jpg';
import entradaRececao4 from '@/public/images/training_center/entry_4.jpg';
import entradaRececao5 from '@/public/images/training_center/entry_5.jpg';

// floors training center
import trainingCenterFloor0 from '@/public/images/training_center/piso_0.png';
import trainingCenterFloor1 from '@/public/images/training_center/piso_1.png';
import trainingCenterFloor2 from '@/public/images/training_center/piso_2.png';

// meeting rooms
import meetingRoom1 from '@/public/images/training_center/meeting_1.jpg';
import meetingRoom2 from '@/public/images/training_center/meeting_2.jpg';
import meetingRoom3 from '@/public/images/training_center/meeting_3.jpg';

// recording Studio
import recording1 from '@/public/images/training_center/recording1.jpg';
import recording2 from '@/public/images/training_center/recording2.jpeg';

const GlobalVillageArquitecture = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
    <section
      id='arquitecture'
      className='mx-10 mb-10 flex max-w-6xl flex-col gap-20 lg:mx-auto'
    >
      <div className='flex flex-col'>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          International Training Center
        </h1>
        <h2 className='mb-4 flex justify-center text-base text-green lg:text-xl'>
          {t('current_exterior_vision')}
        </h2>
        <div className='flex flex-col gap-5'>
          <Image
            src={aereal1}
            alt={'aereal view from google maps'}
            className='flex-1 rounded-3xl'
            sizes='100vw'
            loading='lazy'
          />
          <Image
            src={aereal2}
            alt={'outside current view'}
            className='mx-auto flex-1 rounded-3xl'
            sizes='100vw'
            loading='lazy'
          />
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          {t('future_exterior_vision')}
        </h1>
        <div className='flex h-96 flex-row justify-center gap-4'>
          <Image
            src={exterior1}
            alt={'planta side'}
            className='w-1/2 flex-1 rounded-3xl'
            sizes='100vw'
            loading='lazy'
            style={{ objectFit: 'cover', objectPosition: 'left' }}
          />

          <Image
            src={exterior2}
            alt={'planta side'}
            className='w-1/2 flex-1 rounded-3xl'
            loading='lazy'
            sizes='100vw'
            style={{ objectFit: 'cover' }}
          />
        </div>

        <Image
          className='flex-1 rounded-3xl'
          src={trainingCenterExterior}
          alt={'organization exterior side'}
          sizes='100vw'
          loading='lazy'
          style={{ objectFit: 'cover' }}
        />
        <div>
          <Image
            className='rounded-3xl'
            alt='planta_xray'
            src={plantaExterior}
            style={{ objectFit: 'contain' }}
            sizes='100vw'
            loading='lazy'
          />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          {t('entry_reception')}
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
        <div className='flex h-96 flex-row gap-2'>
          <Image
            className='w-1/2 flex-1 rounded-3xl'
            alt='planta_xray'
            src={entradaRececao4}
            style={{ objectFit: 'cover' }}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw'
          />
          <Image
            className='w-1/2 flex-1 rounded-3xl'
            alt='planta_xray'
            src={entradaRececao5}
            style={{ objectFit: 'cover' }}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw'
          />
        </div>
      </div>
      <div>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          {t('training_meeting_rooms')}
        </h1>
        <div className='flex flex-col gap-2'>
          <Image
            className='flex-1 rounded-3xl'
            alt='planta_xray'
            src={meetingRoom1}
            style={{ objectFit: 'contain' }}
            sizes='100vw'
          />
          <Image
            className='ml-auto w-3/4 flex-1 rounded-3xl'
            alt='planta_xray'
            src={meetingRoom2}
            style={{ objectFit: 'contain' }}
            sizes='100vw'
          />
          <Image
            className='mr-auto w-3/4 flex-1 rounded-3xl'
            alt='planta_xray'
            src={meetingRoom3}
            style={{ objectFit: 'contain' }}
            sizes='100vw'
          />
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          {t('lounge_coworking')}
        </h1>
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='100vw'
        />
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='100vw'
        />
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='100vw'
        />
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='100vw'
        />
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='100vw'
        />
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='100vw'
        />
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='100vw'
        />
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='100vw'
        />
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/meeting_3.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='100vw'
        />
        <Image
          className='mr-auto flex-1 rounded-3xl'
          alt='planta_xray'
          src={'/images/training_center/coworking_10.jpg'}
          style={{ objectFit: 'contain' }}
          height={3840}
          width={2160}
          sizes='100vw'
        />
        <div className='flex flex-row gap-4 px-4'>
          <Image
            className='mr-auto w-1/2 flex-1 rounded-3xl'
            alt='planta_xray'
            src={'/images/training_center/coworking_11.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
            sizes='100vw'
          />
          <Image
            className='mr-auto w-1/2 flex-1 rounded-3xl'
            alt='planta_xray'
            src={'/images/training_center/coworking_12.jpg'}
            style={{ objectFit: 'contain' }}
            height={3840}
            width={2160}
            sizes='100vw'
          />
        </div>
      </div>
      {/* */}
      <div>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          Salas Tecnologica
        </h1>
        <h2 className='text-center text-green'>Gaming Hub</h2>

        {/* missing image*/}
      </div>
      <RecordingStudio lng={lng} />
      <ArielView lng={lng} />
    </section>
  );
};

const RecordingStudio = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
    <div>
      <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
        {t('recording_studio')}
      </h1>
    </div>
  );
};

const ArielView = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-1'>
        <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
          {t('2d_aereal')}
        </h1>
        <h2 className='flex justify-center text-xl text-green'>
          {t('second_floor')}
        </h2>
        <div className='mt-3 flex justify-center rounded-3xl bg-bege-dark p-4'>
          <Image
            className='rounded-3xl'
            alt={t('second_floor')}
            src={trainingCenterFloor2}
            style={{ objectFit: 'cover' }}
            loading='lazy'
          />
        </div>
      </div>
      <div>
        <h2 className='flex justify-center text-xl text-green'>
          {t('first_floor')}
        </h2>
        <div className='mt-3 flex justify-center rounded-3xl bg-bege-dark p-4'>
          <Image
            alt={t('first_floor')}
            src={trainingCenterFloor1}
            style={{ objectFit: 'cover' }}
            sizes='100vw'
            loading='lazy'
          />
        </div>
      </div>
      <div>
        <h2 className='flex justify-center text-xl text-green'>
          {t('ground_floor')}
        </h2>
        <div className='mt-3 flex justify-center rounded-3xl bg-bege-dark p-2'>
          <Image
            alt={t('ground_floor')}
            src={trainingCenterFloor0}
            style={{ objectFit: 'cover' }}
            sizes='100vw'
            loading='lazy'
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalVillageArquitecture;
