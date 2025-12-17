import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { LogosBlock as LogosBlockType } from '@/payload-types';
import Image from 'next/image';

export const LogosBlock: React.FC<LogosBlockType> = ({
  badgeText,
  heading,
  description,
  buttonText,
  logos,
}) => {
  return (
    <section className='py-32'>
      <div className='container'>
        <div className='text-center'>
          {badgeText && <Badge variant='outline'>{badgeText}</Badge>}
          {heading && (
            <h1 className='mx-auto mt-8 mb-5 max-w-3xl text-4xl font-bold text-balance md:text-6xl'>
              {heading}
            </h1>
          )}
          {description && (
            <p className='mx-auto max-w-3xl text-xl font-medium text-balance'>{description}</p>
          )}
          {buttonText && (
            <Button size='lg' className='mt-8'>
              {buttonText}
            </Button>
          )}
        </div>
      </div>
      <div className='mx-auto mt-24 grid max-w-5xl grid-cols-2 place-items-center gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-6'>
        {logos?.map((logo) => (
          <Image
            className='grayscale'
            src={logo.logo}
            key={logo.name}
            alt={logo.name}
            width={144}
            height={80}
          />
        ))}
      </div>
    </section>
  );
};
