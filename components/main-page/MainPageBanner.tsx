import Link from 'next/link';

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
      className='absolute -top-1 z-50 flex w-full justify-center bg-cover bg-center px-20 py-4 text-lg font-semibold'
      style={{
        backgroundColor: !bannerImage ? (bannerColor ?? undefined) : undefined,
        backgroundImage: image ? `url(${image.url})` : undefined,
        color: bannerImage ? 'white' : textColor,
      }}
    >
      <p className='my-auto flex-1'>{bannerText}</p>
      {bannerButtonLink && bannerButtonText && (
        <Link href={bannerButtonLink} target='_blank' className='ml-4'>
          <Button>{bannerButtonText}</Button>
        </Link>
      )}
    </div>
  );
};

export default MainPageBanner;
