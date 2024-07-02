'use client';

import Image from 'next/image';

import { SwiperSlide } from 'swiper/react';
import { Slider } from '../../utils/Slider';
import { pinhelSlideshowImages } from './config';

const PinhelSlider = () => {
  return (
    <div className='mx-auto w-full'>
      <Slider autoplay>
        {pinhelSlideshowImages.map((item, index) => (
          <SwiperSlide
            key={index}
            style={{
              position: 'relative',
              maxHeight: '500px',
              width: '100%',
            }}
          >
            <Image
              src={item.url}
              alt={''}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              style={{ objectFit: 'fill' }}
            />
          </SwiperSlide>
        ))}
      </Slider>
    </div>
  );
};

export default PinhelSlider;
