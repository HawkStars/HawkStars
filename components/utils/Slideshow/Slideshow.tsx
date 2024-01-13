'use client';
import React from 'react';
import Image from 'next/image';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { SlideshowImage } from './types';

type SlideshowProps = {
  images: SlideshowImage[];
  indicators?: boolean;
  duration?: number;
  transitionDuration?: number;
  arrows?: boolean;
};

const Slideshow = ({
  images,
  indicators = true,
  duration = 2000,
  transitionDuration = 2000,
  arrows = true,
}: SlideshowProps) => {
  return (
    <div className='slide-container'>
      <Fade
        duration={duration}
        transitionDuration={transitionDuration}
        indicators={indicators}
        arrows={arrows}
      >
        {images.map((slideImage, index) => (
          <div key={index} className='each-fade flex justify-center bg-cover align-middle'>
            <Image src={slideImage.url} alt='' />
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default Slideshow;
