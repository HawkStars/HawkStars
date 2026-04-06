import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

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
        <Image
          src={image}
          alt={alt}
          width={1920}
          height={400}
          className='h-auto w-full object-cover'
        />
      </Link>
    </section>
  );
};

export default CrowdfundingBanner;
