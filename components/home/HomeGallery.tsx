import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { galleryRows } from './config';
import { Reveal } from '@/components/ui/motion';
import type { HomeSectionProps } from './types';

/** Two rows of project photos drifting in opposite directions; hovering a row pauses it. */
export const HomeGallery = ({ t, lng }: HomeSectionProps) => (
  <section className='overflow-hidden bg-white py-20 md:py-28 lg:py-32'>
    <HawkStarsSection>
      <Reveal className='mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end'>
        <SectionHeader eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} />
        <Button asChild variant='outline' size='lg' className='group shrink-0'>
          <Link href={transformUrl(lng, SITE_GET_URLS.projects)}>
            {t('gallery.cta')}
            <LuArrowRight className='transition-transform group-hover:translate-x-1' />
          </Link>
        </Button>
      </Reveal>
    </HawkStarsSection>

    <div className='flex -rotate-2 flex-col gap-4'>
      {galleryRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            'hover:paused flex w-max gap-4',
            rowIndex % 2 === 0 ? 'animate-marquee' : 'animate-marquee-reverse'
          )}
        >
          {[...row, ...row].map((image, i) => (
            <div
              key={`${image.src}-${i}`}
              aria-hidden={i >= row.length}
              className='group relative h-48 w-64 shrink-0 overflow-hidden rounded-xl sm:h-64 sm:w-88'
            >
              <ImageMedia
                src={image}
                alt={i < row.length ? t('gallery.image_alt') : ''}
                fill
                sizes='352px'
                className='object-cover grayscale-35 transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0'
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  </section>
);
