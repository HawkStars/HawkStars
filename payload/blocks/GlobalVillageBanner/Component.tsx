import React from 'react';

import type { GlobalVillageBannerBlock } from '@/payload-types';
import { HawkStarsSection } from '@/components/layout';
import { ImageMedia } from '@/payload/components/Media';

import starPng from '@/public/images/icons/training_center/star.png';
import gridPng from '@/public/images/icons/training_center/grid.png';

export const GlobalVillageBannerBlockComponent: React.FC<GlobalVillageBannerBlock> = ({
  text,
  sectionId,
}) => {
  if (!text) return null;

  return (
    <HawkStarsSection
      spacing='loose'
      className='bg-green relative overflow-hidden'
      id={sectionId || undefined}
      data-blockid='globalVillageBanner'
    >
      {/* Decorative marks sit in the band's corners, scaled down on phones so they
          never run into the text. */}
      <ImageMedia
        src={starPng}
        alt=''
        width={starPng.width}
        height={starPng.height}
        className='pointer-events-none absolute top-4 right-4 w-10 lg:top-10 lg:right-10 lg:w-auto'
      />
      <ImageMedia
        src={gridPng}
        alt=''
        width={gridPng.width}
        height={gridPng.height}
        className='pointer-events-none absolute bottom-4 left-4 w-8 lg:bottom-10 lg:left-10 lg:w-auto'
      />
      <p className='text-body relative mx-auto max-w-3xl whitespace-pre-line text-white'>{text}</p>
    </HawkStarsSection>
  );
};
