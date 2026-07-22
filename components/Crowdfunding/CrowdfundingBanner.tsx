import { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';

type CrowdfundingBannerProps = {
  image: string | StaticImageData;
  alt: string;
  href: string;
  sectionId: string;
};

const CrowdfundingBanner = ({ image, alt, href, sectionId }: CrowdfundingBannerProps) => {
  return (
    <section id={sectionId} className='w-full cursor-pointer'>
      <Link href={href} target='_blank' rel='noopener noreferrer'>
        <ImageMedia
          src={image}
          alt={alt}
          width={1920}
          height={400}
          className='h-auto w-full object-contain'
        />
      </Link>
    </section>
  );
};

export default CrowdfundingBanner;
