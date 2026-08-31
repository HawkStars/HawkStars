'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LuTarget, LuUsers, LuHeart } from 'react-icons/lu';
import type { DonationProgressBlock as DonationProgressBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getLinkFieldInformation } from '@/utils/page';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { HawkStarsSection } from '@/components/layout';

export const DonationProgressBlock: React.FC<DonationProgressBlockProps> = ({
  title,
  description,
  goalAmount,
  currentAmount,
  currency = '€',
  donorCount,
  links,
  showPercentage = true,
  animateProgress = true,
  theme = 'light',
  sectionId,
}) => {
  const lng = useLanguageCookie();
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const percentage = Math.min((currentAmount / goalAmount) * 100, 100);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

  const themeClasses = {
    light: 'bg-white border border-gray-200',
    dark: 'bg-black text-white border border-gray-700',
    gradient: 'bg-gradient-to-br from-green to-bege-dark text-white',
  };

  const progressBarClasses = {
    light: 'bg-green',
    dark: 'bg-green',
    gradient: 'bg-white',
  };

  const progressBgClasses = {
    light: 'bg-gray-200',
    dark: 'bg-gray-700',
    gradient: 'bg-white/20',
  };

  return (
    <HawkStarsSection
      ref={sectionRef}
      spacing='tight'
      padding='none'
      container
      id={sectionId || undefined}
      data-blockid='donationProgress'
    >
      <div
        className={cn(
          'card-lg rounded-2xl p-8 lg:p-12',
          themeClasses[theme as keyof typeof themeClasses]
        )}
      >
        <div className='flex flex-col gap-8'>
          {/* Header */}
          <div className='text-center'>
            <div className='bg-bege-light mb-4 inline-flex rounded-full p-3'>
              <LuTarget className='text-green h-6 w-6' />
            </div>
            <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
            {description && (
              <p
                className={cn(
                  'mx-auto max-w-2xl text-lg',
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                )}
              >
                {description}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className='space-y-4'>
            <div
              className={cn(
                'relative h-6 w-full overflow-hidden rounded-full',
                progressBgClasses[theme as keyof typeof progressBgClasses]
              )}
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-1000 ease-out',
                  progressBarClasses[theme as keyof typeof progressBarClasses]
                )}
                style={{ width: `${progress}%` }}
              />
              {showPercentage && (
                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-900 transition-colors duration-200 ease-in',
                    {
                      'text-white': (theme != 'gradient' && progress > 50) || theme == 'dark',
                      'text-black': theme != 'dark' && progress <= 50,
                    }
                  )}
                >
                  {Math.round(progress)}%
                </div>
              )}
            </div>

            {/* Stats */}
            <div className='flex flex-wrap justify-between gap-4'>
              <div>
                <div className='text-sm tracking-wide uppercase opacity-70'>Raised</div>
                <div className='text-2xl font-bold lg:text-3xl'>
                  {currency}
                  {currentAmount.toLocaleString()}
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm tracking-wide uppercase opacity-70'>Goal</div>
                <div className='text-2xl font-bold lg:text-3xl'>
                  {currency}
                  {goalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Donor Count & CTA */}
          <div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-between'>
            {donorCount && (
              <div className='flex items-center gap-2 text-lg'>
                <LuUsers className='h-5 w-5' />
                <span>
                  <strong>{donorCount.toLocaleString()}</strong> donors
                </span>
              </div>
            )}
            {links?.map((link, index) => {
              const linkInfo = getLinkFieldInformation(link.link, lng);
              if (!linkInfo) return null;
              const { url, label, newTab } = linkInfo;
              return (
                <Button
                  key={index}
                  size='lg'
                  className={cn(
                    'group',
                    theme === 'gradient' && 'text-green hover:bg-bege-light bg-white'
                  )}
                  asChild
                >
                  <a
                    href={url}
                    target={newTab ? '_blank' : '_self'}
                    rel={newTab ? 'noopener noreferrer' : undefined}
                  >
                    <LuHeart className='mr-2 h-5 w-5' />
                    {label}
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </HawkStarsSection>
  );
};
