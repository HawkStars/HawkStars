import { Slider } from '@/components/utils/Slider';
import { SwiperSlide } from 'swiper/react';

const TopSlider = () => {
  return (
    <>
      <Slider loop={true} autoplay slidesPerView={1}>
        <div>aaaaa</div>
        {/* {photos.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              className='swiper-lazy'
              src={item}
              alt={index.toString()}
              style={{ objectFit: 'cover', height: '100%', width: '100%' }}
            />
          </SwiperSlide>
        ))} */}
      </Slider>
    </>
  );
};

export default TopSlider;
