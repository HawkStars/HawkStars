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

// recording Studio
import gaming1 from '@/public/images/training_center/gaming1.jpg';
import gaming2 from '@/public/images/training_center/gaming2.jpg';

// lounge and coworking
import restaurantPhoto1 from '@/public/images/training_center/restaurant1.jpg';
import restaurantPhoto2 from '@/public/images/training_center/restaurant2.jpg';
import coworkPhoto1 from '@/public/images/training_center/cowork1.jpg';
import coworkPhoto2 from '@/public/images/training_center/cowork2.jpg';
import coworkPhoto3 from '@/public/images/training_center/cowork3.jpg';
import coworkPhoto4 from '@/public/images/training_center/cowork4.jpg';
import coworkPhoto5 from '@/public/images/training_center/cowork5.jpg';
import cowordPhoto11 from '@/public/images/training_center/coworking_11.jpg';
import cowordPhoto12 from '@/public/images/training_center/coworking_12.jpg';
import DonateLink from '../DonateLink/DonateLink';

const GlobalVillageArquitecture = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
    <section
      id='arquitecture'
      className='mx-10 my-10 flex max-w-6xl flex-col gap-20 lg:mx-auto'
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

      <FutureExteriorViewSections lng={lng} />
      <EntryReceptionPhotosSection lng={lng} />
      <TrainingMeetingRooms lng={lng} />
      <LoungeAndCoworking lng={lng} />
      <GamingHub lng={lng} />
      <RecordingStudio lng={lng} />
      <ArielView lng={lng} />
      <div className='-mt-9 flex justify-center'>
        <DonateLink />
      </div>
    </section>
  );
};

const FutureExteriorViewSections = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
        {t('future_exterior_vision')}
      </h1>
      <div className='flex flex-col justify-center gap-4 lg:h-96 lg:flex-row'>
        <Image
          src={exterior1}
          alt={'planta side'}
          className='flex-1 rounded-3xl lg:w-1/2'
          sizes='100vw'
          loading='lazy'
          style={{ objectFit: 'cover', objectPosition: 'left' }}
        />

        <Image
          src={exterior2}
          alt={'planta side'}
          className='flex-1 rounded-3xl lg:w-1/2'
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
  );
};

const EntryReceptionPhotosSection = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
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
          loading='lazy'
        />
        <Image
          className='rounded-3xl'
          alt='planta_xray'
          src={entradaRececao2}
          style={{ objectFit: 'contain' }}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px'
          loading='lazy'
        />
        <Image
          className='rounded-3xl'
          alt='planta_xray'
          src={entradaRececao3}
          style={{ objectFit: 'contain' }}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px'
          loading='lazy'
        />
      </div>
      <div className='flex flex-col gap-2 lg:h-96 lg:flex-row'>
        <Image
          className='flex-1 rounded-3xl lg:w-1/2'
          alt='planta_xray'
          src={entradaRececao4}
          style={{ objectFit: 'cover' }}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw'
          loading='lazy'
        />
        <Image
          className='flex-1 rounded-3xl lg:w-1/2'
          alt='planta_xray'
          src={entradaRececao5}
          style={{ objectFit: 'cover' }}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw'
          loading='lazy'
        />
      </div>
    </div>
  );
};

const TrainingMeetingRooms = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
    <div>
      <h1 className='mb-2 flex justify-center text-2xl text-green lg:text-5xl'>
        {t('training_meeting_rooms')}
      </h1>
      <div className='flex flex-col gap-2'>
        <Image
          className='flex-1 rounded-3xl'
          alt='planta_xray'
          src={meetingRoom1}
          style={{ objectFit: 'contain' }}
          sizes='100vw'
          loading='lazy'
        />
        <Image
          className='ml-auto flex-1 rounded-3xl md:w-3/4'
          alt='planta_xray'
          src={meetingRoom2}
          style={{ objectFit: 'contain' }}
          sizes='100vw'
          loading='lazy'
        />
        <Image
          className='mr-auto flex-1 rounded-3xl md:w-3/4'
          alt='planta_xray'
          src={meetingRoom3}
          style={{ objectFit: 'contain' }}
          sizes='100vw'
          loading='lazy'
        />
      </div>
    </div>
  );
};
const LoungeAndCoworking = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='flex justify-center text-2xl text-green lg:text-5xl'>
        {t('lounge_coworking')}
      </h1>
      <Image
        className='mr-auto flex-1 rounded-3xl'
        alt='cowork photo number four'
        src={coworkPhoto4}
        style={{ objectFit: 'contain' }}
        sizes='100vw'
        loading='lazy'
      />
      <Image
        className='mr-auto flex-1 rounded-3xl'
        alt='cowork photo number five'
        src={coworkPhoto5}
        style={{ objectFit: 'contain' }}
        sizes='100vw'
        loading='lazy'
      />
      <Image
        className='flex-1 rounded-3xl'
        alt='planta_xray'
        src={cowordPhoto12}
        style={{ objectFit: 'contain' }}
        sizes='100vw'
        loading='lazy'
      />
      <div className='flex flex-col gap-4 lg:flex-row lg:px-4'>
        <Image
          className='mr-auto flex-1 rounded-3xl lg:w-1/2'
          alt='planta_xray'
          src={cowordPhoto11}
          style={{ objectFit: 'contain' }}
          sizes='100vw'
          loading='lazy'
        />
        <Image
          className='flex-1 rounded-3xl lg:w-1/2'
          alt='cowork photo number three'
          src={coworkPhoto3}
          style={{ objectFit: 'contain' }}
          sizes='100vw'
          loading='lazy'
        />
      </div>
      <Image
        className='mr-auto flex-1 rounded-3xl'
        alt='cowork image number 2'
        src={coworkPhoto2}
        style={{ objectFit: 'contain' }}
        sizes='100vw'
        loading='lazy'
      />
      <Image
        className='flex-1 rounded-3xl'
        alt='restaurant photo number 1'
        src={restaurantPhoto1}
        style={{ objectFit: 'contain' }}
        sizes='100vw'
        loading='lazy'
      />
      <Image
        className='ml-auto flex-1 rounded-3xl md:w-2/3'
        alt='restaurant photo number 2'
        src={restaurantPhoto2}
        style={{ objectFit: 'contain' }}
        sizes='100vw'
        loading='lazy'
      />
      <Image
        className='mr-auto flex-1 rounded-3xl md:w-2/3'
        alt='cowork image number 1'
        src={coworkPhoto1}
        style={{ objectFit: 'contain' }}
        sizes='100vw'
        loading='lazy'
      />
    </div>
  );
};

const GamingHub = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
    <div className='flex flex-col gap-2'>
      <h1 className='mb-2 flex justify-center text-2xl text-green lg:text-5xl'>
        {t('tech_rooms')}
      </h1>
      <h2 className='text-center text-lg text-green lg:text-3xl'>Gaming Hub</h2>
      <Image
        className='mr-auto flex-1 rounded-3xl'
        alt='gaming image number 1'
        src={gaming1}
        style={{ objectFit: 'contain' }}
        sizes='100vw'
        loading='lazy'
      />
      <Image
        className='mr-auto flex-1 rounded-3xl'
        alt='gaming image number 2'
        src={gaming2}
        style={{ objectFit: 'contain' }}
        sizes='100vw'
        loading='lazy'
      />
    </div>
  );
};

const RecordingStudio = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
    <div className='flex flex-col gap-3'>
      <h1 className='mb-4 flex justify-center text-2xl text-green lg:text-5xl'>
        {t('recording_studio')}
      </h1>
      <Image
        className='mr-auto flex-1 rounded-3xl'
        alt='recording studio image number 1'
        src={recording1}
        style={{ objectFit: 'contain' }}
        sizes='100vw'
        loading='lazy'
      />
      <Image
        className='mr-auto flex-1 rounded-3xl'
        alt='recording studio image number 2'
        src={recording2}
        style={{ objectFit: 'contain' }}
        sizes='100vw'
        loading='lazy'
      />
    </div>
  );
};

const ArielView = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col gap-1'>
        <h1 className='mb-2 flex justify-center text-2xl text-green lg:text-5xl'>
          {t('2d_aereal')}
        </h1>
        <h2 className='mb-2 flex justify-center text-lg text-green lg:text-3xl'>
          {t('second_floor')}
        </h2>
        <div className='flex justify-center rounded-3xl bg-bege-dark p-4'>
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
        <h2 className='my-5 flex justify-center text-lg text-green lg:text-3xl'>
          {t('first_floor')}
        </h2>
        <div className='flex justify-center rounded-3xl bg-bege-dark p-4'>
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
        <h2 className='my-5 flex justify-center text-lg text-green lg:text-3xl'>
          {t('ground_floor')}
        </h2>
        <div className='flex justify-center rounded-3xl bg-bege-dark p-2'>
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
