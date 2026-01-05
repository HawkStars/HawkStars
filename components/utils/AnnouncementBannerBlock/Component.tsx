'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type AnnouncementBannerBlockProps = {
  message: string;
  ctaText?: string;
  ctaLink?: string;
  variant?: 'info' | 'success' | 'warning' | 'urgent';
  dismissible?: boolean;
};

export const AnnouncementBannerBlock: React.FC<AnnouncementBannerBlockProps> = ({
  message,
  ctaText,
  ctaLink,
  variant = 'info',
  dismissible = true,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const variantStyles = {
    info: 'bg-bege-light text-black border-bege-dark',
    success: 'bg-bege-light text-green border-bege-dark',
    warning: 'bg-bege-dark text-black border-green',
    urgent: 'bg-bege-dark text-black border-black',
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    urgent: AlertCircle,
  };

  const Icon = icons[variant as keyof typeof icons];

  return (
    <div className={cn('border-y py-4', variantStyles[variant as keyof typeof variantStyles])}>
      <div className='container mx-auto'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex flex-1 items-center gap-4'>
            <Icon className='h-6 w-6 shrink-0' />
            <p className='flex-1 font-medium'>{message}</p>
          </div>

          <div className='flex items-center gap-3'>
            {ctaLink && ctaText && (
              <Button size='sm' variant='outline' asChild>
                <a href={ctaLink}>{ctaText}</a>
              </Button>
            )}
            {dismissible && (
              <button
                onClick={() => setDismissed(true)}
                className='rounded-full p-1 hover:bg-black/10'
              >
                <X className='h-5 w-5' />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
