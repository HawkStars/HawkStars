import { HawkProject } from '@/payload-types';
import { FC } from 'react';
import { ImageMedia } from '@/payload/components/Media';
import { getImagePayloadUrl } from '@/lib/image';
import { ProjectSection } from '../utils/ProjectSection';

type SingleProjectObjectivesProps = Pick<HawkProject, 'objectives'>;

const SingleProjectObjectives: FC<SingleProjectObjectivesProps> = ({ objectives }) => {
  return (
    <>
      {objectives &&
        (objectives.introduction || (objectives.items && objectives.items.length > 0)) && (
          <ProjectSection>
            <h2 className='mb-8 text-4xl font-bold'>Objetivos</h2>
            {objectives.introduction && (
              <p className='mb-6 text-justify text-base leading-relaxed text-gray-800'>
                {objectives.introduction}
              </p>
            )}
            {objectives.items && objectives.items.length > 0 && (
              <ul className='list-disc space-y-4 pl-6 text-gray-800'>
                {objectives.items.map((item, i) => (
                  <li key={i} className='text-justify leading-relaxed'>
                    {item.text}
                  </li>
                ))}
              </ul>
            )}

            {objectives.objectivesImage &&
              (() => {
                const img = getImagePayloadUrl(objectives.objectivesImage);
                return img?.url ? (
                  <div className='relative my-4 h-40 w-full'>
                    <ImageMedia
                      fill
                      resource={objectives.objectivesImage}
                      alt={img.alt || 'Objectives'}
                      className='rounded-lg object-contain'
                    />
                  </div>
                ) : null;
              })()}
          </ProjectSection>
        )}
    </>
  );
};

export default SingleProjectObjectives;
