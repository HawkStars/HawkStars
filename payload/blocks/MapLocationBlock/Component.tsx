import React from 'react';
import { LuMapPin, LuPhone, LuMail, LuClock } from 'react-icons/lu';
import type { MapLocationBlock as MapLocationBlockProps } from '@/payload-types';
import { HawkStarsSection } from '@/components/layout';

export const MapLocationBlock: React.FC<MapLocationBlockProps> = ({
  title,
  address,
  latitude,
  longitude,
  phone,
  email,
  hours,
  sectionId,
}) => {
  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      container
      id={sectionId || undefined}
      data-blockid='mapLocation'
    >
      {title && (
        <h2 className='mb-10 text-center text-3xl font-bold tracking-tight text-balance lg:mb-12 lg:text-4xl'>
          {title}
        </h2>
      )}

      <div className='grid gap-8 lg:grid-cols-2'>
        {/* Map */}
        <div className='overflow-hidden rounded-xl border border-gray-200'>
          <div className='aspect-square w-full bg-gray-200'>
            <iframe
              width='100%'
              height='100%'
              frameBorder='0'
              style={{ border: 0 }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`}
              allowFullScreen
              aria-label='map'
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className='space-y-6'>
          <div className='flex gap-4'>
            <LuMapPin className='h-6 w-6 shrink-0 text-green-600' />
            <div>
              <h3 className='mb-1 font-semibold'>Address</h3>
              <p className='whitespace-pre-line text-gray-700'>{address}</p>
            </div>
          </div>

          {phone && (
            <div className='flex gap-4'>
              <LuPhone className='h-6 w-6 shrink-0 text-green-600' />
              <div>
                <h3 className='mb-1 font-semibold'>Phone</h3>
                <a href={`tel:${phone}`} className='text-green-600 hover:underline'>
                  {phone}
                </a>
              </div>
            </div>
          )}

          {email && (
            <div className='flex gap-4'>
              <LuMail className='h-6 w-6 shrink-0 text-green-600' />
              <div>
                <h3 className='mb-1 font-semibold'>Email</h3>
                <a href={`mailto:${email}`} className='text-green-600 hover:underline'>
                  {email}
                </a>
              </div>
            </div>
          )}

          {hours && (
            <div className='flex gap-4'>
              <LuClock className='h-6 w-6 shrink-0 text-green-600' />
              <div>
                <h3 className='mb-1 font-semibold'>Hours</h3>
                <p className='whitespace-pre-line text-gray-700'>{hours}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </HawkStarsSection>
  );
};
