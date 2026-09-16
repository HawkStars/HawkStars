'use client';

import React, { useState } from 'react';
import type { ImageComparisonSliderBlock as ImageComparisonSliderBlockProps } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { HawkStarsSection } from '@/components/layout';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';

export const ImageComparisonSliderBlock = ({
  title,
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  sectionId,
  lng,
}: ImageComparisonSliderBlockProps & { lng: Language }) => {
  const { t } = useTranslation(lng, 'common');
  // The English literals were both a runtime default and the field defaultValue, so a
  // pt editor who left them alone shipped "Before"/"After" on a Portuguese page — and
  // a null from the API bypassed the default entirely, leaving the badges empty.
  const beforeText = beforeLabel || t('a11y.beforeLabel');
  const afterText = afterLabel || t('a11y.afterLabel');

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);

  // The divider was a <div> with onMouseDown only — no tabIndex, no role, no key
  // handling — so the block's only interaction was unavailable to keyboard and switch
  // users and the "before" image was permanently pinned at 50% (WCAG 2.1.1).
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') setSliderPosition((p) => Math.max(0, p - step));
    else if (e.key === 'ArrowRight') setSliderPosition((p) => Math.min(100, p + step));
    else if (e.key === 'Home') setSliderPosition(0);
    else if (e.key === 'End') setSliderPosition(100);
    else return;
    e.preventDefault();
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  const before = getImagePayloadUrl(beforeImage);
  const after = getImagePayloadUrl(afterImage);

  if (!before || !after) return null;

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='imageComparisonSlider'
    >
      {title && (
        <h2 className='mb-10 text-center text-3xl font-bold tracking-tight text-balance lg:mb-12 lg:text-4xl'>
          {title}
        </h2>
      )}

      <div
        className='relative mx-auto max-w-4xl overflow-hidden rounded-xl select-none'
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div className='relative aspect-video w-full'>
          {/* After Image (Full) */}
          <ImageMedia src={after.url || ''} alt={after.alt || ''} fill className='object-cover' />

          {/* Before Image (Clipped) */}
          <div
            className='absolute inset-0 overflow-hidden'
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <ImageMedia
              src={before.url || ''}
              alt={before.alt || ''}
              fill
              className='object-cover'
            />
          </div>

          {/* Slider */}
          <div
            role='slider'
            tabIndex={0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(sliderPosition)}
            aria-label={t('a11y.comparisonSlider')}
            onKeyDown={handleKeyDown}
            className='card-lg focus-visible:ring-ring absolute top-0 bottom-0 w-1 cursor-ew-resize bg-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden'
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={() => setIsDragging(true)}
          >
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
              <div className='card-lg flex h-12 w-12 items-center justify-center rounded-full bg-white'>
                <svg
                  className='h-6 w-6 rotate-90 text-gray-700'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 9l4-4 4 4m0 6l-4 4-4-4'
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className='pointer-events-none absolute top-4 left-4 rounded-lg bg-black/50 px-3 py-1 text-sm font-semibold text-white'>
            {beforeText}
          </div>
          <div className='pointer-events-none absolute top-4 right-4 rounded-lg bg-black/50 px-3 py-1 text-sm font-semibold text-white'>
            {afterText}
          </div>
        </div>
      </div>
    </HawkStarsSection>
  );
};
