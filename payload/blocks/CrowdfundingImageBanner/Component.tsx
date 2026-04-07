import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { CrowdfundingImageBannerBlock } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { getLinkFieldInformation } from '@/utils/page';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

export const CrowdfundingImageBannerBlockComponent: React.FC<CrowdfundingImageBannerBlock> = ({
  image,
  url,
  sectionId,
}) => {
  const lng = useLanguageCookie();
  const imageData = getImagePayloadUrl(image);
  const linkUrl = getLinkFieldInformation(url, lng);
  if (!imageData) return null;

  return (
    <section id={sectionId || ''} className='w-full'>
      <Link href={linkUrl?.url || '#'} target='_blank' rel='noopener noreferrer'>
        <Image
          src={imageData.url}
          alt={imageData.alt}
          width={imageData.width || 1920}
          height={imageData.height || 400}
          className='mx-auto h-auto object-contain'
        />
      </Link>
    </section>
  );
};
