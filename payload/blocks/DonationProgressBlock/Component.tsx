'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LuTarget, LuUsers, LuHeart } from 'react-icons/lu';
import type { DonationProgressBlock as DonationProgressBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getLinkFieldInformation } from '@/utils/page';
import { HawkStarsSection } from '@/components/layout';
import { formatCurrency } from '@/lib/utils/currency';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';

export const DonationProgressBlock: React.FC<DonationProgressBlockProps & { lng: Language }> = ({
  title,
  description,
  goalAmount,
  currentAmount,
  donorCount,
  links,
  showPercentage = true,
  animateProgress = true,
  theme = 'light',
  sectionId,
  lng,
}) => {
  const { t } = useTranslation(lng, 'common');
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const percentage = Math.min((currentAmount / goalAmount) * 100, 100);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (animateProgress && inView) {
      const timer = setTimeout(() => {
        setProgress(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else if (!animateProgress) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs progress bar to prop when animation is disabled
      setProgress(percentage);
    }
  }, [percentage, animateProgress, inView]);

  // light: white card · dark: the ink band · gradient: the green brand band.
  const themeClasses = {
    light: 'card-md border border-bege-dark text-black',
    dark: 'card-md bg-ink text-white',
    gradient: 'card-md bg-linear-to-br from-green to-green-dark text-white',
  };

  const progressBarClasses = {
    light: 'bg-green',
    dark: 'bg-white',
    gradient: 'bg-white',
  };

  const progressBgClasses = {
    light: 'bg-bege-dark',
    dark: 'bg-white/20',
    gradient: 'bg-white/20',
  };

  const isLight = theme !== 'dark' && theme !== 'gradient';
  const themeKey = (theme && theme in themeClasses ? theme : 'light') as keyof typeof themeClasses;
  const mutedText = isLight ? 'text-black/60' : 'text-white/80';
  const ctas = (links ?? [])
    .map((link) => getLinkFieldInformation(link.link, lng))
    .filter((info): info is NonNullable<typeof info> => Boolean(info));

  return (
    <HawkStarsSection
      ref={sectionRef}
      spacing='tight'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='donationProgress'
    >
      <div
        className={cn(
          'mx-auto flex max-w-4xl flex-col gap-8 p-6 sm:p-8 lg:p-12',
          themeClasses[themeKey]
        )}
      >
        <header className='flex flex-col items-center text-center'>
          <span
            className={cn(
              'mb-4 inline-flex rounded-full p-3',
              isLight ? 'bg-bege-dark text-green' : 'bg-white/10 text-white'
            )}
          >
            <LuTarget aria-hidden className='size-6' />
          </span>
          <h2 className='text-h2_semibold'>{title}</h2>
          {description && (
            <p
              className={cn(
                'mt-4 max-w-2xl text-lg leading-relaxed',
                isLight ? 'text-black/70' : 'text-white/85'
              )}
            >
              {description}
            </p>
          )}
        </header>

        <div className='flex flex-col gap-3'>
          {/* The headline figure: how much is in, and how far along that is. */}
          <div className='flex items-end justify-between gap-4'>
            <div>
              <div className={cn('text-eyebrow mb-1', mutedText)}>{t('blocks.raised')}</div>
              <div
                className={cn(
                  'font-display text-4xl leading-none font-semibold lg:text-5xl',
                  isLight && 'text-green'
                )}
              >
                {formatCurrency(currentAmount, lng)}
              </div>
            </div>
            {showPercentage && (
              <div
                aria-hidden
                className='font-display text-2xl leading-none font-semibold tabular-nums lg:text-3xl'
              >
                {Math.round(progress)}%
              </div>
            )}
          </div>

          <div
            role='progressbar'
            aria-label={title}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(percentage)}
            className={cn('h-3 w-full overflow-hidden rounded-full', progressBgClasses[themeKey])}
          >
            <div
              className={cn(
                'h-full rounded-full transition-[width] duration-1000 ease-out',
                progressBarClasses[themeKey]
              )}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div
            className={cn(
              'flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm',
              mutedText
            )}
          >
            {Number(donorCount) > 0 ? (
              <span className='flex items-center gap-2'>
                <LuUsers aria-hidden className='size-4' />
                <span>
                  <strong className={isLight ? 'text-black' : 'text-white'}>{donorCount}</strong>{' '}
                  {t('blocks.donors', { count: Number(donorCount) })}
                </span>
              </span>
            ) : (
              <span />
            )}
            <span>
              {t('blocks.goal')}:{' '}
              <strong className={isLight ? 'text-black' : 'text-white'}>
                {formatCurrency(goalAmount, lng)}
              </strong>
            </span>
          </div>
        </div>

        {/* Donate is the "act now" action: the first CTA is the view's one gold button. */}
        {ctas.length > 0 && (
          <div className='flex flex-wrap justify-center gap-4'>
            {ctas.map(({ url, label, newTab }, index) => (
              <Button
                key={index}
                size='xl'
                variant={index === 0 ? 'accent' : isLight ? 'outline' : 'outline-inverse'}
                asChild
              >
                <a
                  href={url}
                  target={newTab ? '_blank' : '_self'}
                  rel={newTab ? 'noopener noreferrer' : undefined}
                >
                  {index === 0 && <LuHeart aria-hidden className='size-5' />}
                  {label}
                </a>
              </Button>
            ))}
          </div>
        )}
      </div>
    </HawkStarsSection>
  );
};
