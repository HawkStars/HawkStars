import React from 'react';
import Image from 'next/image';

import type { GlobalVillageBannerBlock } from '@/payload-types';
import { cn } from '@/lib/utils';

import starPng from '@/public/images/icons/training_center/star.png';
import gridPng from '@/public/images/icons/training_center/grid.png';

const backgroundColors = {
  green: 'bg-green',
  'bege-dark': 'bg-bege-dark',
  'bege-light': 'bg-bege-light',
};

export const GlobalVillageBannerBlockComponent: React.FC<GlobalVillageBannerBlock> = ({
  text,
  backgroundColor = 'green',
}) => {
  return (
    <section className={cn('mb-12', backgroundColor && backgroundColors[backgroundColor])}>
      <div className='relative mx-auto max-w-6xl px-3 py-24 lg:px-40 lg:py-40'>
        <p className='text-white'>{text}</p>
        <Image
          src={starPng}
          alt='decorative star'
          className='absolute top-2 right-4 lg:top-10 lg:right-20 xl:right-10'
        />
        <Image
          src={gridPng}
          alt='decorative grid'
          className='absolute bottom-4 left-4 lg:bottom-10 lg:left-20 xl:left-10'
        />
      </div>
    </section>
  );
};
