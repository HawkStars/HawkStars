import { LuExpand, LuGlobe, LuMoveRight, LuRocket, LuWrench } from 'react-icons/lu';
import Image from 'next/image';
import type { HeroBlock } from '@/payload-types';

import { Button } from '@/components/ui/button';
import { getImagePayloadUrl } from '@/lib/image';
import { getLinkFieldInformation } from '@/utils/page';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

const iconMap = {
  globe: LuGlobe,
  rocket: LuRocket,
  expand: LuExpand,
  wrench: LuWrench,
};

const HeroBlock: React.FC<HeroBlock> = (data) => {
  const lng = useLanguageCookie();
  if (!data) return null;
  const { badge, heading, ctaLink, headerImage, features = [], sectionId } = data;

  const bgImage = getImagePayloadUrl(headerImage);

  const linkInfo = getLinkFieldInformation(ctaLink, lng);

  return (
    <section className='section-loose' id={sectionId || undefined} data-blockId='hero'>
      <div className='section-container'>
        <div className='mx-auto flex max-w-3xl flex-col items-center text-center'>
          {bgImage && bgImage.url && (
            <Image
              src={bgImage.url}
              alt={bgImage.alt || 'Hero'}
              height={48}
              width={48}
              className='mb-6 aspect-square'
            />
          )}
          {badge && (
            <span className='text-muted-foreground mb-4 block text-sm font-medium tracking-widest uppercase md:text-base'>
              {badge}
            </span>
          )}
          {heading && (
            <h1 className='text-4xl font-semibold tracking-tight text-balance lg:text-6xl'>
              {heading}
            </h1>
          )}
          {linkInfo && (
            <Button className='mt-10' size='lg' asChild={!!ctaLink}>
              {ctaLink && (
                <a href={linkInfo.url}>
                  {linkInfo.label}
                  <LuMoveRight className='ml-2' />
                </a>
              )}
            </Button>
          )}
        </div>
        {features && features.length > 0 && (
          <div className='bg-border mt-16 grid gap-px overflow-hidden rounded-xl border md:mt-20 md:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || LuGlobe;
              return (
                <div
                  key={index}
                  className='bg-background flex flex-col gap-4 p-6 transition-colors md:p-8'
                >
                  <IconComponent className='text-green size-7 shrink-0' />
                  <div className='space-y-1.5'>
                    <h2 className='text-base font-semibold'>{feature.title}</h2>
                    <p className='text-muted-foreground text-sm leading-relaxed md:text-base'>
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
