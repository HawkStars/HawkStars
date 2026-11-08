'use client';

import React, { useId, useState } from 'react';
import { LuMail } from 'react-icons/lu';
import { PiCheckCircleThin } from 'react-icons/pi';
import type { NewsletterSignupBlock as NewsletterSignupBlockProps } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { HawkStarsSection } from '@/components/layout';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';

export const NewsletterSignupBlock: React.FC<NewsletterSignupBlockProps & { lng: Language }> = ({
  title,
  description,
  buttonText,
  sectionId,
  lng,
}) => {
  const { t } = useTranslation(lng, 'common');
  // Unique per instance: a page with two signup blocks used to share one hard-coded id,
  // so the second label pointed at the first input.
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale: lng }),
      });

      if (!response.ok) {
        setStatus('error');
        return;
      }

      setStatus('submitted');
      setTimeout(() => {
        setEmail('');
        setStatus('idle');
      }, 3000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <HawkStarsSection
      spacing='tight'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='newsletterSignup'
    >
      {/* Gradient from tokens (green → green-dark) instead of an inline hex gradient. */}
      <div
        data-reveal='scale'
        className='from-green to-green-dark rounded-xl bg-linear-135 px-6 py-10 text-white shadow-md sm:px-8 lg:p-12'
      >
        <div className='mx-auto max-w-2xl text-center'>
          <div className='mb-4 inline-flex size-14 items-center justify-center rounded-full bg-white/10 lg:size-16'>
            <LuMail aria-hidden='true' className='size-7 text-white lg:size-8' />
          </div>
          <h2 className='text-h2_semibold mb-4'>{title}</h2>
          {description && <p className='text-h2_light mb-8 text-white/90'>{description}</p>}

          {status !== 'submitted' ? (
            <form onSubmit={handleSubmit} className='flex flex-col gap-3 sm:flex-row'>
              <label htmlFor={inputId} className='sr-only'>
                {t('newsletter.emailLabel')}
              </label>
              <input
                id={inputId}
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                required
                disabled={status === 'submitting'}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? errorId : undefined}
                className='h-12 min-w-0 flex-1 rounded-md border border-white/30 bg-white/10 px-4 text-base text-white placeholder:text-white/70 focus:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden disabled:opacity-60'
              />
              <Button type='submit' variant='inverse' size='xl' disabled={status === 'submitting'}>
                {buttonText || t('blocks.subscribe')}
              </Button>
            </form>
          ) : (
            <div
              role='status'
              className='flex items-center justify-center gap-3 rounded-lg bg-white/15 p-4'
            >
              <PiCheckCircleThin aria-hidden='true' className='size-6 text-white' />
              <span className='text-lg font-semibold text-white'>{t('newsletter.thankYou')}</span>
            </div>
          )}

          {status === 'error' && (
            <p id={errorId} role='alert' className='mt-3 text-sm font-medium text-white'>
              {t('newsletter.error')}
            </p>
          )}

          <p className='mt-4 text-sm text-white/90'>{t('newsletter.privacyNotice')}</p>
        </div>
      </div>
    </HawkStarsSection>
  );
};
