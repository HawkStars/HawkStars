import { Expand, Globe, MoveRight, Rocket, Wrench } from 'lucide-react';
import Image from 'next/image';
import type { HeroBlock } from '@/payload-types';

import { Button } from '@/components/ui/button';
import { getImagePayloadUrl } from '@/lib/image';
import { getLinkFieldInformation } from '@/utils/page';

const iconMap = {
  globe: Globe,
  rocket: Rocket,
  expand: Expand,
  wrench: Wrench,
};

const HeroBlock: React.FC<HeroBlock> = (data) => {
  if (!data) return null;
  const { badge, heading, ctaLink, headerImage, features = [], sectionId } = data;

  const bgImage = getImagePayloadUrl(headerImage);

  const linkInfo = getLinkFieldInformation(ctaLink);

  return (
    <section className='py-32' id={sectionId || ''}>
      <div className='container mx-auto'>
        <div className='text-center'>
          {bgImage && bgImage.url && (
            <div className='relative flex min-h-8 justify-center'>
              <Image
                src={bgImage.url}
                alt={headerImage.alt || 'Hero'}
                height={32}
                width={32}
                className='absolute mx-auto mb-5 aspect-square'
              />
            </div>
          )}
          {badge && (
            <span className='text-muted-foreground mb-3 text-sm tracking-widest md:text-base'>
              {badge}
            </span>
          )}
          {heading && (
            <h1 className='mt-4 text-4xl font-semibold text-balance lg:text-6xl'>{heading}</h1>
          )}
          {linkInfo && (
            <Button className='mt-8' size='lg' asChild={!!ctaLink}>
              {ctaLink && (
                <a href={linkInfo.url}>
                  {linkInfo.label}
                  <MoveRight className='ml-2' strokeWidth={1} />
                </a>
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
