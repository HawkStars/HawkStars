import Link from 'next/link';
import Image from 'next/image';

import { getImagePayloadUrl } from '@/lib/image';
import { MainPageBannerFields } from '@/payload-types';
import { FC } from 'react';
import { colord } from 'colord';
import { Button } from '../ui/button';

type MainPageBannerProps = MainPageBannerFields;

const MainPageBanner: FC<MainPageBannerProps> = ({
  bannerColor,
  bannerImage,
  bannerText,
  bannerButtonText,
  bannerButtonLink,
}) => {
  const image = bannerImage && getImagePayloadUrl(bannerImage);
  const textColor = bannerColor && colord(bannerColor).isDark() ? '#ffffff' : '#000000';

  return (
    <div
      className='absolute -top-1 z-50 flex w-full justify-center overflow-hidden px-20 py-4 text-lg font-semibold'
      style={{
        backgroundColor: !image ? (bannerColor ?? undefined) : undefined,
        color: image ? 'white' : textColor,
      }}
    >
      {/* Optimised background image — priority-loaded as it is above the fold */}
      {image?.url && (
        <Image src={image.url} alt='' fill className='object-cover' priority aria-hidden='true' />
      )}
      <p className='relative z-10 my-auto flex-1'>{bannerText}</p>
      {bannerButtonLink && bannerButtonText && (
        <Link
          href={bannerButtonLink}
          target='_blank'
          rel='noopener noreferrer'
          className='relative z-10 ml-4'
        >
          <Button>{bannerButtonText}</Button>
        </Link>
      )}
    </div>
  );
};

export default MainPageBanner;
