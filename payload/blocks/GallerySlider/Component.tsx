'use client';

import React from 'react';
import type { GallerySliderBlock as GallerySliderProps, Media } from '@/payload-types';
import { Slider } from '@/components/utils/Slider';
import { SwiperSlide } from 'swiper/react';

export const GallerySliderBlock: React.FC<GallerySliderProps> = ({ images }) => {
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
