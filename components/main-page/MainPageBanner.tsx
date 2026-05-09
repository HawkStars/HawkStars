import { ImageType } from '@/payload-types';
import { FC } from 'react';

type MainPageBannerProps = {
  bannerText?: string | null;
  bannerColor?: string | null;
  bannerImage?: ImageType | null;
};

const MainPageBanner: FC<MainPageBannerProps> = ({ bannerColor, bannerImage, bannerText }) => {
  return (
    <div
      className='fixed top-0 flex w-full justify-center py-4'
      style={{ backgroundColor: bannerColor ?? undefined }}
    >
      {bannerText}
    </div>
  );
};

export default MainPageBanner;
