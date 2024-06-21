import { Swiper } from 'swiper/react';

import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { ReactNode } from 'react';
import { SwiperOptions } from 'swiper/types';

type SliderProps = SwiperOptions & {
  children: ReactNode;
};

export const Slider = ({
  autoplay,
  breakpoints,
  children,
  slidesPerView = 1,
}: SliderProps): JSX.Element => {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 1500 }}
      slidesPerView={slidesPerView}
      breakpoints={breakpoints}
    >
      {children}
    </Swiper>
  );
};
