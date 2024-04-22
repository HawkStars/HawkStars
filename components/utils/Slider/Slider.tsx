// import Swiper JS
'use client';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
// import Swiper core and required modules
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export const Slider = (): JSX.Element => {
  const photos = Array.from({ length: 25 }, (_, i) => `/images/projects/${i + 1}.jpeg`);

  return (
    <Swiper slidesPerView={4} autoplay={{ delay: 3000 }} modules={[Autoplay]}>
      {photos.map((item, index) => (
        <SwiperSlide key={index} style={{ position: 'relative', width: 500, height: 400 }}>
          <Image src={item} alt={index.toString()} fill style={{ objectFit: 'cover' }} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
