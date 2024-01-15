import {
  aboutObjectiveSections,
  missionObjectives,
  visionGoals,
} from '../../app/[lng]/about/config';
import Accordion from '../accordion/Accordion';
import { useTranslation } from '../../i18n';
import { LanguageProps } from '../types';
import Image from 'next/image';

const AboutPage = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'about');
  return (
    <>
      <div className='layout-section grid grid-cols-1 gap-10 lg:mt-10 lg:grid-cols-2'>
        <div className='mt-20 flex flex-col gap-5'>
          <h1>{t('title')}</h1>
          <p className='font-body'>{t('description')}</p>
        </div>
        <div className='mx-auto mt-10 grid grid-cols-2 grid-rows-7 lg:w-[500px]'>
          <div className='row-span-3'>
            <Image height={260} width={249} alt='' src='/images/about/hero/top-left.png' />
          </div>
          <div className='row-span-2'>
            <Image height={150} width={249} alt='' src='/images/about/hero/top-right.png' />
          </div>
          <div className='row-span-4'>
            <Image height={367} width={249} alt='' src='/images/about/hero/bottom-right.png' />
          </div>
          <div className='row-span-3'>
            <Image height={260} width={249} alt='' src='/images/about/hero/bottom-left.png' />
          </div>
        </div>
      </div>
      <div className='layout-section my-10 flex flex-col gap-5 xl:mx-auto'>
        <h2 className='flex justify-center text-center text-green'>{t('objectives.title')}</h2>
        <h3 className='mx-auto flex justify-center text-center lg:w-3/5'>
          {t('objectives.description')}
        </h3>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 '>
          {aboutObjectiveSections.map((section, index) => (
            <TaskComponent key={index} {...section} lng={lng} />
          ))}
        </div>
      </div>
      <div className='bg-bege-light p-4 pb-8 lg:mt-20 lg:px-10 lg:py-20'>
        <div className='layout-section relative grid grid-cols-1 gap-10 lg:grid-cols-2'>
          <Image
            className='absolute bottom-5 left-5 hidden lg:block'
            src='/images/about/mission/icon1.png'
            alt='icon1'
            height={38}
            width={38}
          />
          <Image
            className='absolute left-3 top-5 hidden lg:block'
            src='/images/about/mission/icon2.png'
            alt='icon2'
            height={53}
            width={53}
          />
          <Image
            className='absolute right-5 top-0 hidden lg:block'
            src='/images/about/mission/icon3.png'
            alt='icon3'
            height={100}
            width={100}
          />
          <div className='mx-auto lg:ml-auto'>
            <Image src='/images/about/mission/img.png' height={697} width={446} alt='mission' />
          </div>
          <div className='flex flex-col gap-3'>
            <h1>{t('mission.title')}</h1>
            {missionObjectives.map((missionOpt) => (
              <MissionTaskComponent
                text={missionOpt.text}
                index={missionOpt.id}
                key={missionOpt.id}
                lng={lng}
              />
            ))}
          </div>
        </div>
        <div className='layout-section mt-10 flex flex-col gap-10'>
          <Accordion title={t('vision.title')} defaultOpen={true}>
            <ul className='flex list-disc flex-col gap-3 px-6'>
              {visionGoals.map((option: string) => {
                return (
                  <li className='text-justify' key={option}>
                    {t(`vision.items.${option}`)}
                  </li>
                );
              })}
            </ul>
          </Accordion>
          <Accordion title={t('expansion.title')} defaultOpen={false}>
            <p className='font-body text-justify'>{t('expansion.description')}</p>
          </Accordion>
        </div>
      </div>
    </>
  );
};

type TaskComponentProps = {
  icon: string;
  title: string;
  description: string;
  lng: string;
};
const TaskComponent = async ({ icon, title, description, lng }: TaskComponentProps) => {
  const { t } = await useTranslation(lng, 'about');
  return (
    <div className='flex flex-col gap-2 rounded-xl bg-bege-light p-7'>
      <div className='w-fit rounded-xl bg-bege-dark'>
        <Image src={icon} height={40} width={40} alt='objetive icon' />
      </div>
      <h6 className='font-body-body'>{t(title)}</h6>
      <p className='font-body'>{t(description)}</p>
    </div>
  );
};

type MissionTaskComponentProps = {
  text: string;
  index: number;
  lng: string;
};

const MissionTaskComponent = async ({ text, index, lng }: MissionTaskComponentProps) => {
  const { t } = await useTranslation(lng, 'about');
  let formattedNumber = index.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return (
    <div className='flex flex-col'>
      <h2>{formattedNumber}.</h2>
      <p className='font-body'>{t(text)}</p>
    </div>
  );
};

export default AboutPage;
