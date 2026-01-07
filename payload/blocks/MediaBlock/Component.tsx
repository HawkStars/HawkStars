import React from 'react';
import Image from 'next/image';

import type { MediaBlock as MediaBlockProps } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';

export const MediaBlock: React.FC<MediaBlockProps> = (props) => {
  const { media } = props;

  const image = getImagePayloadUrl(media);
  if (!image) return null;

  return (
    <div className='mx-auto'>
      <Image
        src={image.url}
        alt={media.alt || ''}
        height={image.height || undefined}
        width={image.width || undefined}
        fill={image.width === undefined || image.height === undefined}
      />
    </div>
  );
};
