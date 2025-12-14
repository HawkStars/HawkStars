'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import type { AnnouncementBannerBlock as AnnouncementBannerBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    info: 'bg-blue-50 text-blue-900 border-blue-200',
    success: 'bg-green-50 text-green-900 border-green-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    urgent: 'bg-red-50 text-red-900 border-red-200',
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
