import { ContentSection } from '@/components/layout';
import { HawkProject } from '@/payload-types';
import { FC } from 'react';

type SingleProjectPhasesProps = Pick<HawkProject, 'details'>;

const SingleProjectPhases: FC<SingleProjectPhasesProps> = ({ details }) => {
  if (!details) return null;
  const { text, phases } = details;

  return (
    <ContentSection className='bg-bege-dark'>
      <div>
        {text && <p className='text-base leading-relaxed text-gray-800'>{text}</p>}
        {phases && phases.length > 0 && (
          <ul className='mt-4 list-disc space-y-2 pl-6 text-gray-800'>
            {phases.map((phase, i) => (
              <li key={i}>
                {phase.title && <span className='font-semibold'>{phase.title}: </span>}
                {phase.description && <p>{phase.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </ContentSection>
  );
};

export default SingleProjectPhases;
