import { Expand, Globe, MoveRight, Rocket, Wrench } from 'lucide-react';

import type { HeroBlock } from '@/payload-types';

import { Button } from '@/components/ui/button';

const iconMap = {
  globe: Globe,
  rocket: Rocket,
  expand: Expand,
  wrench: Wrench,
};

const HeroBlock: React.FC<HeroBlock> = (data) => {
  if (!data) return null;
  const {
    badge,
    heading,
    ctaText = 'Start now for free',
    ctaLink,
    headerImage,
    features = [],
  } = data;

  return (
    <section className='py-32'>
      <div className='container mx-auto'>
        <div className='text-center'>
          {headerImage && typeof headerImage !== 'string' && headerImage.url && (
            <img
              src={headerImage.url}
              alt={headerImage.alt || 'Hero'}
              className='mx-auto mb-5 w-16 md:mb-6 md:w-24 lg:mb-7 lg:w-28'
            />
          )}
          {badge && (
            <span className='text-muted-foreground mb-3 text-sm tracking-widest md:text-base'>
              {badge}
            </span>
          )}
          {heading && (
            <h1 className='mt-4 text-4xl font-semibold text-balance lg:text-6xl'>{heading}</h1>
          )}
          {ctaText && (
            <Button className='mt-8' size='lg' asChild={!!ctaLink}>
              {ctaLink ? (
                <a href={ctaLink}>
                  {ctaText}
                  <MoveRight className='ml-2' strokeWidth={1} />
                </a>
              ) : (
                <>
                  {ctaText}
                  <MoveRight className='ml-2' strokeWidth={1} />
                </>
              )}
            </Button>
          )}
        </div>
        {features && features.length > 0 && (
          <div className='bg-input mt-16 grid gap-px overflow-hidden rounded-lg border md:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || Globe;
              return (
                <div key={index} className='bg-background flex flex-col gap-3 p-5 md:gap-6'>
                  <IconComponent className='size-6 shrink-0' />
                  <div>
                    <h2 className='text-sm font-semibold md:text-base'>{feature.title}</h2>
                    <p className='text-muted-foreground text-sm md:text-base'>
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export { HeroBlock };
