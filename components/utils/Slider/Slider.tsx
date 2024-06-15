import { Swiper } from 'swiper/react';

import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { ReactNode } from 'react';

type SliderProps = {
  autoplay?: boolean;
  children: ReactNode;
};

export const Slider = ({ autoplay, children }: SliderProps): JSX.Element => {
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
      {children}
    </Swiper>
  );
};
