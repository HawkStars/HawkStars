import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import type { MapLocationBlock as MapLocationBlockProps } from '@/payload-types';

export const MapLocationBlock: React.FC<MapLocationBlockProps> = ({
  title,
  address,
  latitude,
  longitude,
  phone,
  email,
  hours,
}) => {
  return (
    <section className='py-12 lg:py-20'>
      <div className='container mx-auto'>
        {title && <h2 className='mb-8 text-center text-3xl font-bold lg:text-4xl'>{title}</h2>}

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
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className='space-y-6'>
            <div className='flex gap-4'>
              <MapPin className='h-6 w-6 shrink-0 text-green-600' />
              <div>
                <h3 className='mb-1 font-semibold'>Address</h3>
                <p className='whitespace-pre-line text-gray-700'>{address}</p>
              </div>
            </div>

            {phone && (
              <div className='flex gap-4'>
                <Phone className='h-6 w-6 shrink-0 text-green-600' />
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
                <Mail className='h-6 w-6 shrink-0 text-green-600' />
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
                <Clock className='h-6 w-6 shrink-0 text-green-600' />
                <div>
                  <h3 className='mb-1 font-semibold'>Hours</h3>
                  <p className='whitespace-pre-line text-gray-700'>{hours}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
