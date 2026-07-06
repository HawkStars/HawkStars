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
          <div className='flex gap-2 max-lg:flex-col'>
            <Image
              src={hawkLogo}
              alt='Hawk logo'
              width={160}
              height={160}
              className='items-center object-contain'
            />
            {partners.map((partner) => {
              const { logo, name } = partner.partner as Partner;
              const logoUrl = logo ? (logo as Media).url : null;
              if (!logoUrl) return null;

              return (
                <Image
                  key={partner.id}
                  src={logoUrl}
                  alt={`${name} logo`}
                  width={160}
                  height={160}
                  className='items-center object-contain'
                />
              );
            })}
          </div>
        </ProjectSection>
      )}
    </>
  );
};

export default SingleProjectPartners;
