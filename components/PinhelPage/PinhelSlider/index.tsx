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
              height: '500px',
              width: '100%',
            }}
          >
            <Image src={item.url} alt={''} sizes='100vw' className='object-cover' />
          </SwiperSlide>
        ))}
      </Slider>
    </div>
  );
};

export default PinhelSlider;
