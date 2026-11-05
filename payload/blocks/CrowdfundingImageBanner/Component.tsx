import React from 'react';
import Link from 'next/link';

import type { CrowdfundingImageBannerBlock } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { getLinkFieldInformation } from '@/utils/page';
import { HawkStarsSection } from '@/components/layout';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';

export const CrowdfundingImageBannerBlockComponent = async ({
  image,
  url,
  sectionId,
  lng,
}: CrowdfundingImageBannerBlock & { lng: Language }) => {
  const imageData = getImagePayloadUrl(image);
  if (!imageData) return null;

  const { t } = await getServerTranslation(lng, 'common');
  const linkInfo = url ? getLinkFieldInformation(url, lng) : undefined;

  const banner = (
    <ImageMedia
      src={imageData.url}
      alt={imageData.alt ?? ''}
      width={imageData.width || 1920}
      height={imageData.height || 400}
      sizes='100vw'
      className='mx-auto h-auto w-full object-contain'
    />
  );

  return (
    <HawkStarsSection
      spacing='none'
      padding='none'
      cap='none'
      id={sectionId || undefined}
      data-blockid='crowdfundingImageBanner'
    >
      {linkInfo?.url ? (
        // Without a link the banner used to point at `#` (a dead link that jumped to the
        // top); now it only becomes a link when the editor set one.
        <Link
          href={linkInfo.url}
          target='_blank'
          rel='noopener noreferrer'
          className='block w-full outline-none focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:ring-inset'
        >
          {banner}
          <span className='sr-only'>
            {linkInfo.label ? `${linkInfo.label} ` : ''}({t('a11y.opensInNewTab')})
          </span>
        </Link>
      ) : (
        banner
      )}
    </HawkStarsSection>
  );
};
