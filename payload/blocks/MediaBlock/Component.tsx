import React from 'react';

import type { MediaBlock as MediaBlockProps } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';

// Same figure treatment as a plain rich-text upload (payload/components/utils/upload.tsx):
// the wide column with the site gutter, rounded corners and the prose rhythm, so an image
// inserted as a block doesn't sit edge-to-edge while an uploaded one is inset.
export const MediaBlock: React.FC<MediaBlockProps> = (props) => {
  const { media, sectionId } = props;

  const image = getImagePayloadUrl(media);
  if (!image) return null;

  return (
    <figure className='rt-wide rt-figure' id={sectionId || undefined} data-blockid='mediaBlock'>
      <ImageMedia
        resource={media}
        alt={image.alt ?? ''}
        className='h-auto w-full rounded-xl'
        sizes='(max-width: 896px) 100vw, 896px'
      />
    </figure>
  );
};
