import { HawkProject, Media, Partner } from '@/payload-types';
import { FC } from 'react';
import Image from 'next/image';
import { ProjectSection } from '../utils/ProjectSection';
import { hawkLogo } from '@/utils/models/images/logos';

type SingleProjectPartnersProps = Pick<HawkProject, 'partnersInformation'>;

const SingleProjectPartners: FC<SingleProjectPartnersProps> = ({ partnersInformation }) => {
  const { partners } = partnersInformation || {};
  return (
    <>
      {partners && partners.length > 0 && (
        <ProjectSection>
          <h2 className='mb-10 text-4xl font-bold'>Parceiros</h2>
          <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
            <Image
              src={hawkLogo}
              alt='Hawk logo'
              width={120}
              height={120}
              className='h-24 w-24 object-contain'
            />
            {partners.map((partner) => {
              const { logo, name } = partner.partner as Partner;
              const logoUrl = logo ? (logo as Media).url : null;
              return (
                <div key={partner.id} className='flex flex-col items-center gap-3 text-center'>
                  {logoUrl && (
                    <Image
                      src={logoUrl}
                      alt={`${name} logo`}
                      width={120}
                      height={120}
                      className='h-24 w-24 object-contain'
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ProjectSection>
      )}
    </>
  );
};

export default SingleProjectPartners;
