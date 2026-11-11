import React from 'react';
import Link from 'next/link';
import { LuArrowRight, LuBox, LuRotate3D } from 'react-icons/lu';
import type { Sede3DCtaBlock as Sede3DCtaBlockProps } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { HawkStarsSection } from '@/components/layout';
import { SectionEyebrow } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/motion';
import { ImageMedia } from '@/payload/components/Media';
import { getImagePayloadUrl } from '@/lib/image';
import { Language } from '@/i18n/settings';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import buildingExterior from '@/public/images/training_center/exterior.jpg';

/** Fallback copy, so the block works with only a title filled in. */
const DEFAULTS: Record<Language, { eyebrow: string; button: string; badge: string }> = {
  pt: {
    eyebrow: 'Explora em 3D',
    button: 'Explorar o edifício em 3D',
    badge: 'Modelo 3D interativo',
  },
  en: {
    eyebrow: 'Explore in 3D',
    button: 'Explore the building in 3D',
    badge: 'Interactive 3D model',
  },
};

/**
 * Split green band: copy and highlights on one side, a clickable preview of the
 * building on the other. Both the button and the image lead to `/sede-3d`.
 */
export const Sede3DCtaBlock: React.FC<Sede3DCtaBlockProps & { lng: Language }> = ({
  eyebrow,
  title,
  description,
  highlights,
  buttonLabel,
  image,
  sectionId,
  lng,
}) => {
  const copy = DEFAULTS[lng] ?? DEFAULTS.pt;
  const href = transformUrl(lng, SITE_GET_URLS.sede3d);
  const cmsImage = getImagePayloadUrl(image);
  const label = buttonLabel || copy.button;

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='sede3dCta'
    >
      <div className='from-green to-green-dark relative isolate grid overflow-hidden rounded-xl bg-linear-to-br text-white shadow-md lg:grid-cols-2'>
        <div
          aria-hidden='true'
          className='animate-float pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-white/5'
        />

        <Reveal className='relative flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:p-14'>
          <SectionEyebrow label={eyebrow || copy.eyebrow} variant='inverse' />
          <h2 className='text-h2_semibold'>{title}</h2>
          {description && (
            <p className='mt-4 text-lg leading-relaxed text-white/90'>{description}</p>
          )}

          {highlights && highlights.length > 0 && (
            <ul className='mt-6 flex flex-wrap gap-2'>
              {highlights.map((item, index) => (
                <li
                  key={item.id || index}
                  className='rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm'
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}

          <div className='mt-8'>
            <Button asChild size='xl' variant='inverse'>
              <Link href={href}>
                <LuRotate3D aria-hidden='true' className='size-5' />
                {label}
                <LuArrowRight aria-hidden='true' className='size-5' />
              </Link>
            </Button>
          </div>
        </Reveal>

        {/* Decorative duplicate of the button's link: hidden from assistive tech and tab order. */}
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden='true'
          className='group relative block min-h-64 overflow-hidden lg:min-h-full'
        >
          {cmsImage?.url ? (
            <ImageMedia
              src={cmsImage.url}
              alt=''
              fill
              sizes='(min-width: 1024px) 50vw, 100vw'
              className='object-cover object-left transition-transform duration-700 group-hover:scale-105'
            />
          ) : (
            <ImageMedia
              src={buildingExterior}
              alt=''
              fill
              sizes='(min-width: 1024px) 50vw, 100vw'
              className='object-cover object-left transition-transform duration-700 group-hover:scale-105'
            />
          )}
          <span className='absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent' />
          <span className='absolute inset-0 flex items-center justify-center'>
            <span className='text-green flex size-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110'>
              <LuBox className='size-9' />
            </span>
          </span>
          <span className='absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm'>
            {copy.badge}
          </span>
        </Link>
      </div>
    </HawkStarsSection>
  );
};
