import React from 'react';
import type { SocialProofBlock as SocialProofBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';

export const SocialProofBlock: React.FC<SocialProofBlockProps> = ({
  stats = [],
  backgroundColor = 'white',
}) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-green-500 to-blue-600 text-white',
  };

  return (
    <section className={cn('py-12 lg:py-16', bgClasses[backgroundColor as keyof typeof bgClasses])}>
      <div className='container mx-auto'>
        <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
          {stats.map((stat, index) => (
            <div key={index} className='text-center'>
              <div className='mb-2 text-4xl font-bold lg:text-5xl'>{stat.value}</div>
              <div className={cn('text-sm font-medium uppercase tracking-wide', backgroundColor === 'gradient' ? 'opacity-90' : 'text-gray-600')}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
