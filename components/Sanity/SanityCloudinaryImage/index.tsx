import { CloudinaryAsset } from "@/projects/sanity/sanity.types";
import classNames from "classnames";

type SanityCloudinaryImageProps = {
  image?: CloudinaryAsset | null;
  className?: string;
};

const SanityCloudinaryImage = (props: SanityCloudinaryImageProps) => {
  const { image, className } = props;
  if (!image) return <></>;

  return (
    <>
      <img src={image.secure_url} loading='lazy' className={classNames("w-full object-contain", className)} />
    </>
  );
};

export default SanityCloudinaryImage;
