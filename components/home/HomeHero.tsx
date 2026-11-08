import Link from 'next/link';
import { LuArrowRight, LuChevronDown } from 'react-icons/lu';
import { ImageMedia } from '@/payload/components/Media';
import { Button } from '@/components/ui/button';
import { SectionEyebrow } from '@/components/ui/SectionHeader';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { heroImage } from './config';
import { StarRing } from './StarRing';
import type { HomeSectionProps } from './types';

const Word = ({ children, delay }: { children: string; delay: number }) => (
  <span className='animate-rise inline-block' style={{ animationDelay: `${delay}ms` }}>
    {children}
  </span>
);

/** Splits a line into words so each one rises in on its own beat. */
const AnimatedLine = ({ text, startDelay }: { text: string; startDelay: number }) => (
  <span className='block'>
    {text.split(' ').map((word, i) => (
      <span key={`${word}-${i}`}>
        <Word delay={startDelay + i * 120}>{word}</Word>{' '}
      </span>
    ))}
  </span>
);

export const HomeHero = ({ t, lng }: HomeSectionProps) => (
  <section className='bg-green-dark relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden text-white'>
    <div className='absolute inset-0 -z-20'>
      <ImageMedia
        src={heroImage}
        alt=''
        fill
        priority
        sizes='100vw'
        className='animate-ken-burns object-cover'
      />
    </div>
    <div className='from-green-dark via-green-dark/85 to-ink/70 absolute inset-0 -z-10 bg-linear-to-br' />
    <div className='from-green-dark absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t to-transparent' />

    <div className='mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:px-8'>
      <div>
        <div className='animate-rise'>
          <SectionEyebrow label={t('hero.eyebrow')} variant='inverse' />
        </div>
        <h1 className='text-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.95] uppercase'>
          <AnimatedLine text={t('hero.title_line1')} startDelay={150} />
          <span className='text-bege-dark'>
            <AnimatedLine text={t('hero.title_line2')} startDelay={450} />
          </span>
        </h1>
        <p
          className='text-h2_light animate-rise mt-8 max-w-xl text-white/85'
          style={{ animationDelay: '800ms' }}
        >
          {t('hero.description')}
        </p>
        <div
          className='animate-rise mt-10 flex flex-wrap gap-4'
          style={{ animationDelay: '1000ms' }}
        >
          <Button asChild variant='inverse' size='xl' className='group'>
            <Link href={transformUrl(lng, SITE_GET_URLS.how_to_help_us)}>
              {t('hero.cta_primary')}
              <LuArrowRight className='transition-transform group-hover:translate-x-1' />
            </Link>
          </Button>
          <Button asChild variant='accent' size='xl'>
            <Link href={transformUrl(lng, SITE_GET_URLS.contribute)}>{t('hero.cta_donate')}</Link>
          </Button>
        </div>
      </div>

      <div
        className='animate-rise mx-auto hidden w-full max-w-sm sm:block lg:max-w-md'
        style={{ animationDelay: '500ms' }}
      >
        <StarRing label={t('hero.ring_label')} />
      </div>
    </div>

    <a
      href='#mission'
      className='absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs font-semibold tracking-widest text-white/70 uppercase hover:text-white'
    >
      {t('hero.scroll')}
      <LuChevronDown aria-hidden='true' className='animate-scroll-cue size-5' />
    </a>
  </section>
);
