import { CloudinaryAsset } from '@/sanity.types';

type SanityCloudinaryImageProps = {
  image?: CloudinaryAsset | null;
};

const SanityCloudinaryImage = (props: SanityCloudinaryImageProps) => {
  const { image } = props;
  if (!image) return <></>;

  return (
    <>
      <img src={image.secure_url} loading='lazy' className='rounded-lg' />
    </>
  );
};

export default SanityCloudinaryImage;
