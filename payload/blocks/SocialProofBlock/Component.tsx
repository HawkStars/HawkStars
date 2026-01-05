import React from 'react';
import type { SocialProofBlock as SocialProofBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';

const textAlignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

export const SocialProofBlock: React.FC<SocialProofBlockProps> = ({
  stats = [],
  backgroundColor = 'white',
  textAlign = 'center',
  title,
  subtitle,
}) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-bege-light',
    gradient: 'bg-gradient-to-br from-green to-bege-dark text-white',
  };

  return (
    <section className={cn('py-12 lg:py-16', bgClasses[backgroundColor as keyof typeof bgClasses])}>
      <div className='container mx-auto'>
        <div
          className={cn(
            'mb-12',
            textAlign && textAlignClasses[textAlign as keyof typeof textAlignClasses]
          )}
        >
          <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
          {subtitle && <p className={cn('text-lg lg:text-xl')}>{subtitle}</p>}
        </div>
        <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
          {stats.map((stat, index) => (
            <div key={index} className='text-center'>
              <div className='mb-2 text-4xl font-bold lg:text-5xl'>{stat.value}</div>
              <div
                className={cn(
                  'text-sm font-medium tracking-wide uppercase',
                  backgroundColor === 'gradient' ? 'opacity-90' : 'text-gray-600'
                )}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
