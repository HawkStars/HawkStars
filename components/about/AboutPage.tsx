import {
  aboutObjectiveSections,
  missionObjectives,
  visionGoals,
} from '../../app/[lng]/about/config';
import { getServerTranslation } from '../../i18n';
import { LanguageProps } from '../types';
import Image from 'next/image';
import Accordion from '../utils/Accordion/Accordion';
import { HawkStarsSection } from '@/components/layout';
import { OffsetSection } from '@/components/layout/OffsetSection';

import type { JSX } from 'react';

const AboutPage = async ({ lng }: LanguageProps) => {
  const { t } = await getServerTranslation(lng, 'about');
  return (
    <>
      <HawkStarsSection>
        <div className='grid grid-cols-1 gap-10 lg:mt-10 lg:grid-cols-2'>
          <div className='mt-10 flex flex-col gap-5 lg:mt-20'>
            <h1 className='lg:text-h1_semibold text-h2_bold'>{t('title')}</h1>
            <p className='lg:text-h2_light text-body_regular'>{t('description')}</p>
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
        <div className='my-10 flex flex-col gap-5 xl:mx-auto'>
          <h2 className='text-h2_bold text-green flex justify-center text-center'>
            {t('objectives.title')}
          </h2>
          <h3 className='text-h2_light mx-auto flex justify-center text-center lg:w-3/5'>
            {t('objectives.description')}
          </h3>
          <div className='grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3'>
            {aboutObjectiveSections.map((section, index) => (
              <TaskComponent key={index} {...section} lng={lng} />
            ))}
          </div>
        </div>

        <OffsetSection bgColor='bege-light'>
          <div className='p-4 pb-8 lg:mt-20 lg:px-10 lg:py-20'>
            <div className='relative mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2'>
              <Image
                className='absolute bottom-5 left-5 hidden lg:block'
                src='/images/about/mission/icon1.png'
                alt='icon1'
                height={38}
                width={38}
              />
              <Image
                className='absolute top-5 left-3 hidden lg:block'
                src='/images/about/mission/icon2.png'
                alt='icon2'
                height={53}
                width={53}
              />
              <Image
                className='absolute top-0 right-5 hidden lg:-top-5 lg:block'
                src='/images/about/mission/icon3.png'
                alt='icon3'
                height={100}
                width={100}
              />
              <div className='mx-auto lg:ml-auto'>
                <Image src='/images/about/mission/img.png' height={697} width={446} alt='mission' />
              </div>
              <div className='flex flex-col gap-3'>
                <h2 className='text-h1_semibold mb-12'>{t('mission.title')}</h2>
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
            <div className='mx-auto mt-28 flex max-w-6xl flex-col gap-10 max-lg:mt-10'>
              <Accordion title={t('vision.title')} defaultOpen={true}>
                <ul className='flex list-disc flex-col gap-3 px-6'>
                  {visionGoals.map((option: string) => {
                    return (
                      <li className='lg:text-h2_light text-body_regular' key={option}>
                        {t(`vision.items.${option}`)}
                      </li>
                    );
                  })}
                </ul>
              </Accordion>
              <Accordion title={t('expansion.title')} defaultOpen={false}>
                {t('expansion.description')}
              </Accordion>
            </div>
          </div>
        </OffsetSection>
      </HawkStarsSection>
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
  const { t } = await getServerTranslation(lng, 'about');
  return (
    <div className='bg-bege-light flex flex-col gap-2 rounded-xl p-7'>
      <div className='bg-bege-dark w-fit rounded-xl'>
        <Image src={icon} height={40} width={40} alt='objetive icon' />
      </div>
      <h6 className='text-body_semibold'>{t(title)}</h6>
      <p className='text-body_regular'>{t(description)}</p>
    </div>
  );
};

type MissionTaskComponentProps = {
  text: string;
  index: number;
  lng: string;
};

const MissionTaskComponent = async ({
  text,
  index,
  lng,
}: MissionTaskComponentProps): Promise<JSX.Element> => {
  const { t } = await getServerTranslation(lng, 'about');
  let formattedNumber = index.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return (
    <div className='flex flex-col'>
      <h2 className='text-h2_bold'>{formattedNumber}.</h2>
      <p>{t(text)}</p>
    </div>
  );
};

export default AboutPage;
