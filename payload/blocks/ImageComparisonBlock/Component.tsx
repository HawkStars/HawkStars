'use client';

import { ImageComparisonSlider } from '@/components/ui/image-comparison-slider-horizontal';
import { ImageComparison, Media } from '@/payload-types';
import { FC } from 'react';

export const SideBySideComparison: FC<ImageComparison> = ({
  afterImage,
  beforeImage,
  initialSliderPosition,
}) => {
  const leftImageType = beforeImage.imageType;
  const rightImageType = afterImage.imageType;
  const leftImage =
    leftImageType === 'upload' ? (beforeImage.image as Media).url : beforeImage.externalImage;
  const rightImage =
    rightImageType === 'upload' ? (afterImage.image as Media).url : afterImage.externalImage;

  if (!leftImage || !rightImage) return null;
  return (
    <ImageComparisonSlider
      leftImage={leftImage}
      rightImage={rightImage}
      initialPosition={initialSliderPosition || 50}
    />
  );
};
