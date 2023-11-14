import Accordion from '@/components/accordion/Accordion';
import { TFunction } from 'i18next';

type TrainingCenterObjetives = {
  title: string;
  points: string[];
};

const GlobalVillageObjectives = ({ t }: { t: TFunction }) => {
  const objetives: TrainingCenterObjetives[] = t('objetives.items', {
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
