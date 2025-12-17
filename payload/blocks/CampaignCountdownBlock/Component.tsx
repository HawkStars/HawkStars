'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import type { CampaignCountdownBlock as CampaignCountdownBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CampaignCountdownBlock: React.FC<CampaignCountdownBlockProps> = ({
  title,
  description,
  targetDate,
  ctaText = 'Take Action',
  ctaLink,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  theme = 'light',
  completedMessage = 'Campaign Ended',
}) => {
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

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-black border-gray-700 text-white',
    urgent: 'bg-gradient-to-br from-green to-bege-dark border-green text-white',
  };

  const digitBgClasses = {
    light: 'bg-gray-100',
    dark: 'bg-gray-800',
    urgent: 'bg-white/20',
  };

  const units = [
    { value: timeLeft.days, label: 'Days', show: showDays },
    { value: timeLeft.hours, label: 'Hours', show: showHours },
    { value: timeLeft.minutes, label: 'Minutes', show: showMinutes },
    { value: timeLeft.seconds, label: 'Seconds', show: showSeconds },
  ].filter((unit) => unit.show);

  return (
    <section className='py-12 lg:py-16'>
      <div className='container mx-auto'>
        <div
          className={cn(
            'card-lg rounded-2xl border p-8 lg:p-12',
            themeClasses[theme as keyof typeof themeClasses]
          )}
        >
          {/* Header */}
          <div className='mb-8 text-center'>
            <div className='bg-bege-light mb-4 inline-flex rounded-full p-3'>
              <Clock className='text-green h-6 w-6' />
            </div>
            <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
            {description && <p className='mx-auto max-w-2xl text-lg opacity-90'>{description}</p>}
          </div>

          {/* Countdown or Completed Message */}
          {isComplete ? (
            <div className='mb-8 text-center'>
              <div className='bg-bege-dark inline-flex items-center gap-2 rounded-lg px-6 py-4 text-2xl font-bold text-black'>
                <Calendar className='h-8 w-8' />
                {completedMessage}
              </div>
            </div>
          ) : (
            <div className='mb-8 grid grid-cols-2 gap-4 md:flex md:justify-center md:gap-6'>
              {units.map((unit, index) => (
                <div key={index} className='flex flex-col items-center'>
                  <div
                    className={cn(
                      'mb-2 flex h-20 w-20 items-center justify-center rounded-lg text-4xl font-bold md:h-24 md:w-24 md:text-5xl',
                      digitBgClasses[theme as keyof typeof digitBgClasses]
                    )}
                  >
                    {String(unit.value).padStart(2, '0')}
                  </div>
                  <div className='text-sm font-semibold tracking-wider uppercase opacity-70'>
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          {ctaLink && ctaText && (
            <div className='text-center'>
              <Button
                size='lg'
                className={cn(
                  'text-lg',
                  theme === 'urgent' && 'text-green hover:bg-bege-light bg-white'
                )}
                asChild
              >
                <a href={ctaLink}>{ctaText}</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
