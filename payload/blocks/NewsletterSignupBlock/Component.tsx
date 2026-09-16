'use client';

import React, { useState } from 'react';
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
      <div
        className='rounded-2xl p-8 text-white lg:p-12'
        style={{ background: 'linear-gradient(135deg, #0a7558 0%, #064f39 100%)' }}
      >
        <div className='mx-auto max-w-2xl text-center'>
          <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10'>
            <LuMail className='h-8 w-8 text-white' />
          </div>
          <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
          {description && <p className='mb-8 text-lg opacity-90'>{description}</p>}

          {status !== 'submitted' ? (
            <form onSubmit={handleSubmit} className='flex flex-col gap-3 sm:flex-row'>
              <label htmlFor='newsletter-email' className='sr-only'>
                {t('newsletter.emailLabel')}
              </label>
              <input
                id='newsletter-email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                required
                disabled={status === 'submitting'}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
                className='flex-1 rounded-lg border-0 bg-black/20 px-6 py-3 text-lg text-white placeholder-white/90 backdrop-blur-sm focus:bg-white/20 focus:ring-2 focus-visible:ring-white focus-visible:outline-hidden disabled:opacity-60'
              />
              <Button
                type='submit'
                size='lg'
                disabled={status === 'submitting'}
                className='text-green bg-white font-semibold hover:bg-white/90 disabled:opacity-60'
              >
                {buttonText || t('blocks.subscribe')}
              </Button>
            </form>
          ) : (
            <div
              role='status'
              className='flex items-center justify-center gap-3 rounded-lg bg-white/15 p-4'
            >
              <PiCheckCircleThin className='h-6 w-6 text-white' />
              <span className='text-lg font-semibold text-white'>{t('newsletter.thankYou')}</span>
            </div>
          )}

          {status === 'error' && (
            <p id='newsletter-error' role='alert' className='mt-3 text-sm font-medium text-white'>
              {t('newsletter.error')}
            </p>
          )}

          <p className='mt-4 text-sm opacity-90'>{t('newsletter.privacyNotice')}</p>
        </div>
      </div>
    </HawkStarsSection>
  );
};
