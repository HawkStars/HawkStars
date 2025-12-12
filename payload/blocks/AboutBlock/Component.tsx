import { type SVGProps, useId } from 'react';
import type { AboutBlock as AboutBlockProps } from '@/payload-types';

import Image from 'next/image';
import { getImagePayloadUrl } from '@/lib/image';

export const AboutBlock: React.FC<AboutBlockProps> = ({ title, description, image }) => {
  const imageData = getImagePayloadUrl(image);
  return (
    <section className='py-32'>
      {/* Hero Section */}
      <section className='relative container mx-auto max-w-5xl py-10 md:py-12 lg:py-15'>
        <div className=''>
          <h1 className='text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl'>{title}</h1>
          <p className='text-muted-foreground mt-4 max-w-2xl text-2xl md:text-3xl'>{description}</p>
          {imageData?.url && (
            <div className='mt-6'>
              <Image
                src={imageData.url}
                alt={imageData.alt || title || ''}
                width={600}
                height={400}
                className='rounded-lg'
              />
            </div>
          )}
        </div>
        {/* Background decoration */}
        <>
          <div className='absolute -inset-40 z-[-1] mask-[radial-gradient(circle_at_center,black_0%,black_20%,transparent_80%)]'>
            <PlusSigns className='text-foreground/5 h-full w-full' />
          </div>
        </>
      </section>
    </section>
  );
};

interface PlusSignsProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const PlusSigns = ({ className, ...props }: PlusSignsProps) => {
  const GAP = 16;
  const STROKE_WIDTH = 1;
  const PLUS_SIZE = 6;
  const id = useId();
  const patternId = `plus-pattern-${id}`;

  return (
    <svg width={GAP * 2} height={GAP * 2} className={className} {...props}>
      <defs>
        <pattern id={patternId} x='0' y='0' width={GAP} height={GAP} patternUnits='userSpaceOnUse'>
          <line
            x1={GAP / 2}
            y1={(GAP - PLUS_SIZE) / 2}
            x2={GAP / 2}
            y2={(GAP + PLUS_SIZE) / 2}
            stroke='currentColor'
            strokeWidth={STROKE_WIDTH}
          />
          <line
            x1={(GAP - PLUS_SIZE) / 2}
            y1={GAP / 2}
            x2={(GAP + PLUS_SIZE) / 2}
            y2={GAP / 2}
            stroke='currentColor'
            strokeWidth={STROKE_WIDTH}
          />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill={`url(#${patternId})`} />
    </svg>
  );
};
