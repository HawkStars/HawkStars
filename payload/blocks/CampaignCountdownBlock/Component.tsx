'use client';

import React, { useState, useEffect } from 'react';
import { LuClock, LuCalendar } from 'react-icons/lu';
import type { CampaignCountdownBlock as CampaignCountdownBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getLinkFieldInformation } from '@/utils/page';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CampaignCountdownBlock: React.FC<CampaignCountdownBlockProps & { lng: Language }> = ({
  title,
  description,
  targetDate,
  links,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  theme = 'light',
  completedMessage,
  sectionId,
  lng,
}) => {
  const { t } = useTranslation(lng, 'common');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsComplete(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsComplete(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // light: white card · dark: the ink band · urgent: terracotta, the palette's colour for time.
  const themeClasses = {
    light: 'card-md border border-bege-dark text-black',
    dark: 'card-md bg-ink text-white',
    urgent: 'card-md bg-terracotta text-white',
  };

  const digitBgClasses = {
    light: 'bg-bege-light text-green',
    dark: 'bg-white/10',
    urgent: 'bg-white/15',
  };

  const iconBgClasses = {
    light: 'bg-bege-dark text-green',
    dark: 'bg-white/10 text-white',
    urgent: 'bg-white/15 text-white',
  };

  const isLight = theme !== 'dark' && theme !== 'urgent';

  const units = [
    { value: timeLeft.days, label: t('blocks.countdownDays'), show: showDays },
    { value: timeLeft.hours, label: t('blocks.countdownHours'), show: showHours },
    { value: timeLeft.minutes, label: t('blocks.countdownMinutes'), show: showMinutes },
    { value: timeLeft.seconds, label: t('blocks.countdownSeconds'), show: showSeconds },
  ].filter((unit) => unit.show);

  return (
    <HawkStarsSection
      spacing='tight'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='campaignCountdown'
    >
      <div
        className={cn(
          'mx-auto max-w-4xl p-6 sm:p-8 lg:p-12',
          themeClasses[theme as keyof typeof themeClasses] ?? themeClasses.light
        )}
      >
        <header className='mb-8 flex flex-col items-center text-center'>
          <span
            className={cn(
              'mb-4 inline-flex rounded-full p-3',
              iconBgClasses[theme as keyof typeof iconBgClasses] ?? iconBgClasses.light
            )}
          >
            <LuClock aria-hidden className='size-6' />
          </span>
          <h2 className='text-h2_semibold'>{title}</h2>
          {description && (
            <p
              className={cn(
                'mt-4 max-w-2xl text-lg leading-relaxed',
                isLight ? 'text-black/70' : 'text-white'
              )}
            >
              {description}
            </p>
          )}
        </header>

        {/* Countdown or Completed Message */}
        {isComplete ? (
          <div className='mb-8 text-center'>
            <p className='bg-bege-dark inline-flex items-center gap-3 rounded-lg px-6 py-4 text-xl font-semibold text-black lg:text-2xl'>
              <LuCalendar aria-hidden className='size-6 shrink-0' />
              {completedMessage || t('blocks.campaignEnded')}
            </p>
          </div>
        ) : (
          // Ticks every second, so keep it out of the live-region announcements.
          <div
            role='timer'
            aria-live='off'
            className='mb-8 flex flex-wrap justify-center gap-2 sm:gap-4 lg:gap-6'
          >
            {units.map((unit) => (
              <div key={unit.label} className='flex flex-col items-center gap-2'>
                <span
                  className={cn(
                    'font-display flex size-16 items-center justify-center rounded-lg text-3xl font-semibold tabular-nums sm:size-20 sm:text-4xl lg:size-24 lg:text-5xl',
                    digitBgClasses[theme as keyof typeof digitBgClasses] ?? digitBgClasses.light
                  )}
                >
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'text-eyebrow tracking-wider',
                    isLight ? 'text-black/60' : 'text-white'
                  )}
                >
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {links && links.length > 0 && (
          <div className='flex flex-wrap justify-center gap-4'>
            {links.map((link, index) => {
              const linkInfo = getLinkFieldInformation(link.link, lng);
              if (!linkInfo) return null;
              const { url, label, newTab } = linkInfo;
              const primary = index === 0;

              return (
                <Button
                  key={index}
                  size='xl'
                  variant={
                    isLight
                      ? primary
                        ? 'default'
                        : 'outline'
                      : primary
                        ? 'inverse'
                        : 'outline-inverse'
                  }
                  asChild
                >
                  <a
                    href={url}
                    target={newTab ? '_blank' : '_self'}
                    rel={newTab ? 'noopener noreferrer' : undefined}
                  >
                    {label}
                  </a>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </HawkStarsSection>
  );
};
