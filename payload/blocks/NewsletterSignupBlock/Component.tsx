'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import type { NewsletterSignupBlock as NewsletterSignupBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const NewsletterSignupBlock: React.FC<NewsletterSignupBlockProps> = ({
  title,
  description,
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  formAction,
  theme = 'light',
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

  const themeClasses = {
    light: 'bg-gray-50 text-gray-900',
    dark: 'bg-gray-900 text-white',
    gradient: 'bg-gradient-to-br from-green-500 to-blue-600 text-white',
  };

  const inputClasses = {
    light: 'bg-white border-gray-300',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gradient: 'bg-white/20 border-white/30 text-white placeholder:text-white/70',
  };

  return (
    <section className='py-12 lg:py-16'>
      <div className='container mx-auto'>
        <div
          className={cn(
            'rounded-2xl p-8 lg:p-12',
            themeClasses[theme as keyof typeof themeClasses]
          )}
        >
          <div className='mx-auto max-w-2xl text-center'>
            <Mail className='mx-auto mb-4 h-12 w-12' />
            <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
            {description && <p className='mb-8 text-lg opacity-90'>{description}</p>}

            {!submitted ? (
              <form onSubmit={handleSubmit} className='flex flex-col gap-4 sm:flex-row'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder as string}
                  required
                  className={cn(
                    'flex-1 rounded-lg border px-6 py-3 text-lg focus:ring-2 focus:ring-green-500 focus:outline-none',
                    inputClasses[theme as keyof typeof inputClasses]
                  )}
                />
                <Button
                  type='submit'
                  size='lg'
                  className={cn(
                    theme === 'gradient' && 'bg-white text-green-600 hover:bg-gray-100'
                  )}
                >
                  {buttonText}
                </Button>
              </form>
            ) : (
              <div className='flex items-center justify-center gap-3 rounded-lg bg-green-100 p-4 text-green-800'>
                <CheckCircle className='h-6 w-6' />
                <span className='text-lg font-semibold'>Thank you for subscribing!</span>
              </div>
            )}

            <p className='mt-4 text-sm opacity-70'>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
