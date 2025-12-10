'use client';

import { ImageComparisonSlider } from '@/components/ui/image-comparison-slider-horizontal';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageComparison } from '@/payload-types';
import { FC } from 'react';

export const SideBySideComparison: FC<ImageComparison> = ({
  afterImage,
  beforeImage,
  initialSliderPosition,
}) => {
  const leftImage = getImagePayloadUrl(beforeImage);
  const rightImage = getImagePayloadUrl(afterImage);

  if (!leftImage.url || !rightImage.url) return null;
  return (
    <ImageComparisonSlider
      leftImage={leftImage.url}
      rightImage={rightImage.url}
      altLeft={leftImage.alt}
      altRight={rightImage.alt}
      initialPosition={initialSliderPosition || 50}
    />
  );
};
