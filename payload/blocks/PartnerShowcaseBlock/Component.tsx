import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import type { PartnerShowcaseBlock as PartnerShowcaseBlockProps, Media } from '@/payload-types';

export const PartnerShowcaseBlock: React.FC<PartnerShowcaseBlockProps> = ({
  title,
  partners = [],
  layout = 'logos',
}) => {
  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <section className='bg-gray-50 py-12 lg:py-20'>
      <div className='container mx-auto'>
        {title && <h2 className='mb-12 text-center text-3xl font-bold lg:text-4xl'>{title}</h2>}
        
        {layout === 'logos' && (
          <div className='grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4'>
            {partners.map((partner, index) => {
              const logo = typeof partner.logo === 'string' ? null : (partner.logo as Media);
              
              return (
                <div
                  key={index}
                  className='flex items-center justify-center rounded-lg bg-white p-6 transition-shadow hover:shadow-md'
                >
                  {logo && (
                    <div className='relative h-20 w-full'>
                      {partner.website ? (
                        <a href={partner.website} target='_blank' rel='noopener noreferrer'>
                          <Image
                            src={logo.url || ''}
                            alt={partner.name}
                            fill
                            className='object-contain grayscale transition-all hover:grayscale-0'
                          />
                        </a>
                      ) : (
                        <Image
                          src={logo.url || ''}
                          alt={partner.name}
                          fill
                          className='object-contain'
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {layout === 'detailed' && (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {partners.map((partner, index) => {
              const logo = typeof partner.logo === 'string' ? null : (partner.logo as Media);
              
              return (
                <div key={index} className='rounded-xl bg-white p-6 shadow-sm'>
                  {logo && (
                    <div className='relative mb-4 h-24 w-full'>
                      <Image
                        src={logo.url || ''}
                        alt={partner.name}
                        fill
                        className='object-contain'
                      />
                    </div>
                  )}
                  <h3 className='mb-2 text-xl font-semibold'>{partner.name}</h3>
                  {partner.description && (
                    <p className='mb-4 text-gray-700'>{partner.description}</p>
                  )}
                  {partner.website && (
                    <a
                      href={partner.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 text-green-600 hover:underline'
                    >
                      Visit Website
                      <ExternalLink className='h-4 w-4' />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
