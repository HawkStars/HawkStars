'use client';

import React, { useState } from 'react';
import { LuMail } from 'react-icons/lu';
import { PiCheckCircleThin } from 'react-icons/pi';
import type { NewsletterSignupBlock as NewsletterSignupBlockProps } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { HawkStarsSection } from '@/components/layout';

export const NewsletterSignupBlock: React.FC<NewsletterSignupBlockProps> = ({
  title,
  description,
  buttonText = 'Subscribe',
  sectionId,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would submit to the formAction URL
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 3000);
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

          {!submitted ? (
            <form onSubmit={handleSubmit} className='flex flex-col gap-3 sm:flex-row'>
              <label htmlFor='newsletter-email' className='sr-only'>
                Email
              </label>
              <input
                id='newsletter-email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={'Your email address'}
                required
                className='flex-1 rounded-lg border-0 bg-white/15 px-6 py-3 text-lg text-white placeholder-white/90 backdrop-blur-sm focus:bg-white/20 focus:ring-2 focus-visible:ring-white focus-visible:outline-hidden'
              />
              <Button
                type='submit'
                size='lg'
                className='text-green bg-white font-semibold hover:bg-white/90'
              >
                {buttonText}
              </Button>
            </form>
          ) : (
            <div
              role='status'
              className='flex items-center justify-center gap-3 rounded-lg bg-white/15 p-4'
            >
              <PiCheckCircleThin className='h-6 w-6 text-white' />
              <span className='text-lg font-semibold text-white'>Thank you for subscribing!</span>
            </div>
          )}

          <p className='mt-4 text-sm opacity-90'>
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </HawkStarsSection>
  );
};
