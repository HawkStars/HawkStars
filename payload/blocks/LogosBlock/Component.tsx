import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { LogosBlock as LogosBlockType } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { HawkStarsSection } from '@/components/layout';

export const LogosBlock: React.FC<LogosBlockType> = ({
  badgeText,
  heading,
  description,
  buttonText,
  logos,
  sectionId,
}) => {
  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      container
      id={sectionId || undefined}
      data-blockid='logosBlock'
    >
      <div className='text-center'>
        {badgeText && <Badge variant='outline'>{badgeText}</Badge>}
        {heading && (
          <h2 className='mx-auto mt-8 mb-5 max-w-3xl text-4xl font-bold tracking-tight text-balance md:text-5xl'>
            {heading}
          </h2>
        )}
        {description && (
          <p className='mx-auto max-w-3xl text-xl font-medium text-balance text-gray-600'>
            {description}
          </p>
        )}
        {buttonText && (
          <Button size='lg' className='mt-8'>
            {buttonText}
          </Button>
        )}
      </div>
      <div className='mx-auto mt-12 grid max-w-5xl grid-cols-2 place-items-center gap-x-6 gap-y-8 md:grid-cols-3 lg:mt-16 lg:grid-cols-4 lg:gap-8'>
        {logos?.map((logo) => (
          <ImageMedia
            className='opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0'
            src={logo.logo}
            key={logo.name}
            alt={logo.name}
            width={144}
            height={80}
            unoptimized
          />
        ))}
      </div>
    </HawkStarsSection>
  );
};
