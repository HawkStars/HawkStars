import { useTranslation } from '@/i18n';
import Accordion from '../../accordion/Accordion';
import { LanguageProps } from '@/components/types';

type TrainingCenterObjetives = {
  title: string;
  points: string[];
};

const GlobalVillageObjectives = async ({ lng }: LanguageProps) => {
  const { t } = await useTranslation(lng, 'training_center');
  const objetives: TrainingCenterObjetives[] = t('objetives.items', {
    returnObjects: true,
  });

  return (
    <section className='mx-10 mt-10 flex max-w-6xl flex-col gap-6 lg:mx-auto' id='objetives'>
      <h2 className='mb-4 flex justify-center text-center text-3xl text-green lg:mx-auto lg:mb-10 lg:w-2/3'>
        {t('objetives.title')}
      </h2>
      {objetives &&
        objetives.length > 0 &&
        objetives.map((objective: TrainingCenterObjetives) => (
          <Accordion key={objective.title} title={objective.title}>
            <ul className='flex list-disc flex-col gap-5 px-6'>
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
