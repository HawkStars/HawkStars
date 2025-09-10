import classNames from 'classnames';

// change this to payload

type SanityCloudinaryImageProps = {
  image?: any | null;
  className?: string;
};

const SanityCloudinaryImage = (props: SanityCloudinaryImageProps) => {
  const { image, className } = props;
  if (!image) return <></>;

  return (
    <>
      <img
        src={image.secure_url}
        loading='lazy'
        className={classNames('w-full object-contain', className)}
      />
    </>
  );
};

export default SanityCloudinaryImage;
