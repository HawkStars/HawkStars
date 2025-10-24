import { Swiper } from 'swiper/react';

import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { ReactNode, type JSX } from 'react';
import { SwiperOptions } from 'swiper/types';

type SliderProps = SwiperOptions & {
  children: ReactNode;
};

export const Slider = (props: SliderProps): JSX.Element => {
  const { children, ...otherProps } = props;
  return (
    <Swiper lazyPreloadPrevNext={1} modules={[Autoplay]} {...otherProps}>
      {children}
    </Swiper>
  );
};
