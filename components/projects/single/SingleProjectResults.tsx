import { Section } from '@/components/layout/Section';
import { getImagePayloadUrl } from '@/lib/image';
import { HawkProject } from '@/payload-types';
import Image from 'next/image';
import { FC } from 'react';

type SingleProjectReportsProps = Pick<HawkProject, 'results'>;

const SingleProjectReports: FC<SingleProjectReportsProps> = ({ results }) => {
  const img = getImagePayloadUrl(results?.resultsImage);

  return (
    <>
      {results && (results.text || results.resultsImage) && (
        <Section>
          <h2 className='mb-8 text-4xl font-bold'>Resultados</h2>
          <div className='grid items-start gap-10 md:grid-cols-3'>
            {results.text && (
              <p className='col-span-2 text-justify text-base leading-relaxed text-gray-800'>
                {results.text}
              </p>
            )}
            {img && (
              <Image
                src={img.url}
                alt={img.alt || 'Results'}
                width={600}
                height={400}
                className='rounded-lg object-cover'
              />
            )}
          </div>
        </Section>
      )}
    </>
  );
};

export default SingleProjectReports;
