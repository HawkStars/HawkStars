import React from 'react';
import { Heart, Clock } from 'lucide-react';
import type { VolunteerCalloutBlock as VolunteerCalloutBlockProps } from '@/payload-types';
import { Button } from '@/components/ui/button';

export const VolunteerCalloutBlock: React.FC<VolunteerCalloutBlockProps> = ({
  title,
  description,
  opportunities = [],
  ctaText = 'Apply Now',
  ctaLink,
}) => {
  return (
    <section className='bg-gradient-to-br from-purple-500 to-pink-600 py-12 text-white lg:py-20'>
      <div className='container mx-auto'>
        <div className='mb-12 text-center'>
          <Heart className='mx-auto mb-4 h-16 w-16' />
          <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
          {description && <p className='mx-auto max-w-2xl text-lg opacity-90'>{description}</p>}
        </div>

        {opportunities && opportunities.length > 0 && (
          <div className='mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {opportunities.map((opp, index) => (
              <div key={index} className='rounded-xl bg-white/10 p-6 backdrop-blur-sm'>
                <h3 className='mb-3 text-xl font-semibold'>{opp.role}</h3>
                {opp.description && <p className='mb-4 opacity-90'>{opp.description}</p>}
                {opp.commitment && (
                  <div className='flex items-center gap-2 text-sm'>
                    <Clock className='h-4 w-4' />
                    {opp.commitment}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {ctaLink && ctaText && (
          <div className='text-center'>
            <Button size='lg' className='bg-white text-purple-600 hover:bg-gray-100' asChild>
              <a href={ctaLink}>{ctaText}</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
