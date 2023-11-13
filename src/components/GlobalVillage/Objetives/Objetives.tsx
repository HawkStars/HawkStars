'use client';
import useTranslation from 'next-translate/useTranslation';

import Accordion from '@/components/accordion/Accordion';

type TrainingCenterObjetives = {
  title: string;
  points: string[];
};

const GlobalVillageObjectives = () => {
  const { t, lang } = useTranslation('training_center');

  const objetives: TrainingCenterObjetives[] = t('objetives.items', undefined, {
    returnObjects: true,
  });
  return (
    <section className='mx-4 flex flex-col gap-3 lg:mx-10' id='objetives'>
      <h1>{t('objetives.title')}</h1>
      {objetives &&
        objetives.length > 0 &&
        objetives.map((objective: TrainingCenterObjetives) => (
          <Accordion key={objective.title} title={objective.title}>
            <ul className='flex list-disc flex-col gap-3 px-6'>
              {objective.points.map((option: string) => {
                return (
                  <li className='text-justify' key={option}>
                    {option}
                  </li>
                );
              })}
            </ul>
          </Accordion>
        ))}
    </section>
  );
};

export default GlobalVillageObjectives;
