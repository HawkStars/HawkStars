'use client';

import SliderSkeleton from '@/components/skeletons/SliderSkeleton';
import DelayComponent from '@/components/utils/DelayComponent';
import { Slider } from '@/components/utils/Slider';
import { SwiperSlide } from 'swiper/react';

const photos = Array.from({ length: 25 }, (_, i) => `/images/projects/${i + 1}.jpeg`);

const ErasmusSlider = () => {
  return (
    <>
      <section className='flex flex-col gap-6 py-20'>
        <h6 className='text-h2_light text-center text-green'>Erasmus +</h6>

        <DelayComponent fallback={<SliderSkeleton />}>
          <div className='flex h-96 w-dvw'>
            <Slider
              loop={true}
              autoplay
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
            >
              {photos.map((item, index) => (
                <SwiperSlide key={index}>
                  <img
                    className='swiper-lazy'
                    src={item}
                    alt={index.toString()}
                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                  />
                </SwiperSlide>
              ))}
            </Slider>
          </div>
        </DelayComponent>
      </section>
    </>
  );
};

export default ErasmusSlider;
