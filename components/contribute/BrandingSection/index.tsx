import Image, { StaticImageData } from 'next/image';

type BrandingSectionProps = {
  image: StaticImageData;
  altImage: string;
  title: string;
  price: string;
  description: string;
};

const BrandingSection = ({ image, title, price, description, altImage }: BrandingSectionProps) => {
  return (
    <div className='flex flex-1 flex-col gap-3'>
      <h3 className='text-h2_light mx-10 text-center lg:h-14'>{title}</h3>
      <Image src={image} alt={altImage} className='rounded-lg' />
      <h4 className='text-body_semibold w-fit rounded-2xl text-green'>{price}</h4>
      <p className='text-body_regular'>{description}</p>
    </div>
  );
};

export default BrandingSection;
