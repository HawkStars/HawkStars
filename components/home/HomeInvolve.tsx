import Link from 'next/link';
import { LuArrowUpRight, LuMail } from 'react-icons/lu';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { CONTACT_EMAIL, involvePaths } from './config';
import { Reveal } from '@/components/ui/motion';
import type { HomeSectionProps } from './types';

export const HomeInvolve = ({ t, lng }: HomeSectionProps) => (
  <HawkStarsSection
    spacing='loose'
    className='bg-green relative isolate overflow-hidden text-white'
  >
    <div className='animate-float absolute -top-32 -right-32 -z-10 size-96 rounded-full bg-white/5' />
    <div
      className='animate-float absolute -bottom-40 -left-20 -z-10 size-[28rem] rounded-full bg-white/5'
      style={{ animationDelay: '2s' }}
    />

    <Reveal>
      <SectionHeader
        variant='inverse'
        eyebrow={t('involve.eyebrow')}
        title={t('involve.title')}
        subtitle={t('involve.description')}
        align='center'
        titleClassName='text-white text-h1_semibold'
        subtitleClassName='text-white/80 max-w-2xl'
        className='mb-14'
      />
    </Reveal>

    <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
      {involvePaths.map(({ key, path, accent }, i) => (
        <Reveal key={`${key}-${path}`} delay={i * 120} className='h-full'>
          <Link
            href={transformUrl(lng, SITE_GET_URLS[path])}
            className={cn(
              'group flex h-full flex-col rounded-xl p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-md',
              accent ? 'bg-gold text-ink' : 'hover:text-green bg-white/10 text-white hover:bg-white'
            )}
          >
            <span className='flex items-start justify-between gap-4'>
              <h3 className='text-h3_semibold'>{t(`involve.${key}.title`)}</h3>
              <LuArrowUpRight
                aria-hidden='true'
                className='size-6 shrink-0 transition-transform duration-500 group-hover:rotate-45'
              />
            </span>
            <p
              className={cn('mt-3 text-sm leading-relaxed', accent ? 'text-ink/80' : 'opacity-80')}
            >
              {t(`involve.${key}.description`)}
            </p>
          </Link>
        </Reveal>
      ))}
    </div>

    <Reveal delay={500} className='mt-12 text-center'>
      <p className='text-white/80'>
        {t('involve.contact')}{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className='inline-flex items-center gap-2 font-semibold text-white underline-offset-4 hover:underline'
        >
          <LuMail aria-hidden='true' />
          {CONTACT_EMAIL}
        </a>
      </p>
    </Reveal>
  </HawkStarsSection>
);
