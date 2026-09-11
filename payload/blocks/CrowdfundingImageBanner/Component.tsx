import React from 'react';
import Link from 'next/link';

import type { CrowdfundingImageBannerBlock } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { getLinkFieldInformation } from '@/utils/page';
import { cn } from '@/lib/utils';
import { Language } from '@/i18n/settings';

export const CrowdfundingImageBannerBlockComponent: React.FC<
  CrowdfundingImageBannerBlock & { lng: Language }
> = ({ image, url, sectionId, lng }) => {
  const imageData = getImagePayloadUrl(image);
  const linkUrl = getLinkFieldInformation(url, lng);
  if (!imageData) return null;

  return (
    <section id={sectionId || undefined} data-blockid='crowdfundingImageBanner'>
      <Link href={linkUrl?.url || '#'} target='_blank' rel='noopener noreferrer'>
        <ImageMedia
          src={imageData.url}
          alt={imageData.alt ?? ''}
          width={imageData.width || 1920}
          height={imageData.height || 400}
          className={cn('mx-auto h-auto w-full object-contain', {})}
        />
      </Link>
    </section>
  );
};
