import React from 'react';

import type { MediaBlock as MediaBlockProps } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';

export const MediaBlock: React.FC<MediaBlockProps> = (props) => {
  const { media, sectionId } = props;

  const image = getImagePayloadUrl(media);
  if (!image) return null;

  return (
    <div className='relative mx-auto w-full' id={sectionId || undefined} data-blockid='mediaBlock'>
      <ImageMedia resource={media} alt={media.alt || ''} className='object-cover' />
    </div>
  );
};
