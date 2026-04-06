import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { CrowdfundingImageBannerBlock } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';

export const CrowdfundingImageBannerBlockComponent: React.FC<CrowdfundingImageBannerBlock> = ({
  image,
  url,
  sectionId,
}) => {
  const imageData = getImagePayloadUrl(image);
  if (!imageData) return null;

  return (
    <section id={sectionId || ''} className="w-full">
      <Link href={url} target="_blank" rel="noopener noreferrer">
        <Image
          src={imageData.url}
          alt={imageData.alt}
          width={imageData.width || 1920}
          height={imageData.height || 400}
          className="h-auto w-full object-cover"
        />
      </Link>
    </section>
  );
};
