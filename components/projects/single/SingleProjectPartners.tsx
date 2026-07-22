import { HawkProject, Media, Partner } from '@/payload-types';
import { FC } from 'react';
import { ImageMedia } from '@/payload/components/Media';
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
          <div className='flex flex-wrap justify-between gap-4'>
            <div className='relative h-32 w-32'>
              <ImageMedia
                src={hawkLogo}
                alt='Hawk logo'
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='items-center object-contain'
              />
            </div>
            {partners.map((partner) => {
              const { logo, name } = partner.partner as Partner;
              const logoUrl = logo ? (logo as Media).url : null;
              if (!logoUrl) return null;

              return (
                <div className='relative h-32 w-32' key={partner.id}>
                  <ImageMedia
                    key={partner.id}
                    src={logoUrl}
                    alt={`${name} logo`}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    className='items-center object-contain'
                  />
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
