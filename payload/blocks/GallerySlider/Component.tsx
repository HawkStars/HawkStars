'use client';

import React, { useState, useEffect } from 'react';
import type { GallerySliderBlock as GallerySliderProps, Media } from '@/payload-types';
import Image from 'next/image';
import { Slider } from '@/components/utils/Slider';
import { SwiperSlide } from 'swiper/react';
import image from 'next/image';

export const GallerySliderBlock: React.FC<GallerySliderProps> = ({
  images,
  autoplay,
  autoplayDelay,
}) => {
  if (!images || images.length === 0) return null;

  return (
    <div className='container'>
      <Slider autoplay>
        {images.map((item, index) => {
          const image = item?.image as Media;
          const url = image?.url;
          if (!url) return null;

          return (
            <SwiperSlide key={index}>
              <img src={url} alt={image.alt} className='object-cover' />
            </SwiperSlide>
          );
        })}
      </Slider>
    </div>
  );
};
