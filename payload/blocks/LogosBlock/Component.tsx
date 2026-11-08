import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionEyebrow } from '@/components/ui/SectionHeader';
import type { LogosBlock as LogosBlockType } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';

export const LogosBlock = ({
  badgeText,
  heading,
  description,
  buttonText,
  buttonLink,
  logos,
  sectionId,
  lng,
}: LogosBlockType & { lng: Language }) => {
  const isInternal = buttonLink?.startsWith('/');

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='logosBlock'
    >
      <header className='section-header flex flex-col items-center text-center'>
        {badgeText && <SectionEyebrow label={badgeText} />}
        {heading && (
          <h2 data-reveal='up' className='text-h2_semibold'>
            {heading}
          </h2>
        )}
        {description && (
          <p data-reveal='up' className='text-h2_light mt-4 max-w-2xl text-black/70'>
            {description}
          </p>
        )}
        {buttonText && buttonLink && (
          <Button size='lg' className='mt-8' asChild>
            {isInternal ? (
              <Link href={`/${lng}${buttonLink}`}>{buttonText}</Link>
            ) : (
              <a href={buttonLink} target='_blank' rel='noopener noreferrer'>
                {buttonText}
              </a>
            )}
          </Button>
        )}
      </header>

      {/* Every logo sits in the same 160×64 frame and is scaled to fit, so wide wordmarks
          and square crests read at the same visual weight. */}
      <ul
        data-reveal-stagger='scale'
        className='mx-auto grid max-w-5xl grid-cols-2 place-items-center gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-10'
      >
        {logos?.map((logo) => (
          <li key={logo.id || logo.name} className='relative h-14 w-full max-w-40 lg:h-16'>
            <ImageMedia
              className='object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0'
              src={logo.logo}
              alt={logo.name}
              fill
              sizes='160px'
              unoptimized
            />
          </li>
        ))}
      </ul>
    </HawkStarsSection>
  );
};
