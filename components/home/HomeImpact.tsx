import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { ImageMedia } from '@/payload/components/Media';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { impactImage, impactStats } from './config';
import { CountUp, Reveal } from '@/components/ui/motion';
import type { HomeSectionProps } from './types';

/** The 2022 Ukraine operation — the moment Hawk Stars was reborn — told in numbers. */
export const HomeImpact = ({ t, lng }: HomeSectionProps) => (
  <HawkStarsSection spacing='loose' className='bg-ink relative isolate overflow-hidden text-white'>
    <div className='absolute inset-0 -z-10 opacity-15 mix-blend-luminosity'>
      <ImageMedia src={impactImage} alt='' fill sizes='100vw' className='object-cover' />
    </div>
    <div className='from-ink via-ink/90 absolute inset-0 -z-10 bg-linear-to-r to-transparent' />

    <div className='grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20'>
      <Reveal>
        <SectionHeader
          variant='inverse'
          eyebrow={t('impact.eyebrow')}
          title={t('impact.title')}
          subtitle={t('impact.description')}
          titleClassName='text-white'
          subtitleClassName='text-white/80'
        />
        <Button asChild variant='outline-inverse' size='xl' className='group mt-10'>
          <Link href={transformUrl(lng, SITE_GET_URLS.history)}>
            {t('impact.cta')}
            <LuArrowRight className='transition-transform group-hover:translate-x-1' />
          </Link>
        </Button>
      </Reveal>

      <dl className='grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-3'>
        {impactStats.map(({ key, value, unit }, i) => (
          <Reveal
            key={key}
            delay={i * 100}
            from='scale'
            className='bg-ink/80 flex flex-col-reverse justify-end gap-2 p-6 backdrop-blur-sm transition-colors hover:bg-white/5 lg:p-8'
          >
            <dt className='text-sm leading-snug text-white/70'>{t(`impact.stats.${key}`)}</dt>
            <dd className='text-h1_semibold text-white'>
              {unit?.position === 'prefix' && (
                <span className='text-bege-dark mr-1'>{t(`impact.units.${unit.key}`)}</span>
              )}
              <CountUp value={value} locale={lng} />
              {unit?.position === 'suffix' && (
                <span className='text-bege-dark ml-1 text-[0.55em]'>
                  {t(`impact.units.${unit.key}`)}
                </span>
              )}
            </dd>
          </Reveal>
        ))}
      </dl>
    </div>
  </HawkStarsSection>
);
