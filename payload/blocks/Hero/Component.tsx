import React from 'react';
import type { HeroBlock as HeroProps } from '@/payload-types';
import { Media } from '../../components/Media';
import { CMSLink } from '@/payload/components/Link';
import { cn } from '@/lib/utils';

export const HeroBlock: React.FC<HeroProps> = ({
  heading,
  subheading,
  backgroundImage,
  overlayOpacity,
  links,
}) => {
  const overlayStyle = {
    backgroundColor: `rgba(0, 0, 0, ${(overlayOpacity || 50) / 100})`,
  };

  return (
    <div className='relative min-h-[500px] w-full overflow-hidden lg:min-h-[600px]'>
      {/* Background Image */}
      {backgroundImage && typeof backgroundImage === 'object' && (
        <div className='absolute inset-0'>
          <Media resource={backgroundImage} imgClassName='h-full w-full object-cover' />
        </div>
      )}

      {/* Overlay */}
      {backgroundImage && <div className='absolute inset-0' style={overlayStyle} />}

      {/* Content */}
      <div className='relative z-10 container flex min-h-[500px] flex-col items-center justify-center text-center lg:min-h-[600px]'>
        <h1
          className={cn(
            'mb-4 text-4xl font-bold lg:text-6xl',
            backgroundImage ? 'text-white' : 'text-foreground'
          )}
        >
          {heading}
        </h1>

        {subheading && (
          <p
            className={cn(
              'mb-8 max-w-2xl text-lg lg:text-xl',
              backgroundImage ? 'text-white/90' : 'text-muted-foreground'
            )}
          >
            {subheading}
          </p>
        )}

        {/* Links/CTAs */}
        {links && links.length > 0 && (
          <div className='flex flex-wrap justify-center gap-4'>
            {links.map(({ link }, i) => {
              return <CMSLink key={i} size='lg' {...link} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
