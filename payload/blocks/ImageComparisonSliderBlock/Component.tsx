'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type {
  ImageComparisonSliderBlock as ImageComparisonSliderBlockProps,
  Media,
} from '@/payload-types';

export const ImageComparisonSliderBlock: React.FC<ImageComparisonSliderBlockProps> = ({
  title,
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  sectionId,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
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

  const before = typeof beforeImage === 'string' ? null : (beforeImage as Media);
  const after = typeof afterImage === 'string' ? null : (afterImage as Media);

  if (!before || !after) return null;

  return (
    <section className='py-12 lg:py-20' id={sectionId || ''}>
      <div className='container mx-auto'>
        {title && <h2 className='mb-8 text-center text-3xl font-bold lg:text-4xl'>{title}</h2>}

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
            <Image src={after.url || ''} alt={afterLabel || ''} fill className='object-cover' />

            {/* Before Image (Clipped) */}
            <div
              className='absolute inset-0 overflow-hidden'
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image src={before.url || ''} alt={beforeLabel || ''} fill className='object-cover' />
            </div>

            {/* Slider */}
            <div
              className='card-lg absolute top-0 bottom-0 w-1 cursor-ew-resize bg-white'
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={() => setIsDragging(true)}
            >
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
                <div className='card-lg flex h-12 w-12 items-center justify-center rounded-full bg-white'>
                  <svg
                    className='h-6 w-6 text-gray-700'
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
              {beforeLabel}
            </div>
            <div className='pointer-events-none absolute top-4 right-4 rounded-lg bg-black/50 px-3 py-1 text-sm font-semibold text-white'>
              {afterLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
