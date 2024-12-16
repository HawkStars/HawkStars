import { CloudinaryAsset } from 'sanity-plugin-cloudinary';

const SanityCloudinaryImage = (image: CloudinaryAsset) => {
  return (
    <>
      <img src={image.secure_url} loading='lazy' />
    </>
  );
};

export default SanityCloudinaryImage;
