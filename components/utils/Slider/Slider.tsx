import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { ReactNode } from 'react';

type SliderProps = {
  autoplay: boolean;
  children: ReactNode;
};

export const Slider = (): JSX.Element => {
  const photos = Array.from({ length: 25 }, (_, i) => `/images/projects/${i + 1}.jpeg`);

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 1500 }}
      height={400}
      style={{ maxWidth: '100%' }}
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
        <SwiperSlide
          key={index}
          style={{
            position: 'relative',
            width: '500px',
            height: '400px',
            maxWidth: '500px',
            maxHeight: '400px',
          }}
        >
          <Image
            src={item}
            alt={index.toString()}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            style={{ objectFit: 'cover', maxWidth: '500px' }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
