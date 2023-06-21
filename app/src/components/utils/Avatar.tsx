import Image from "next/image";
import { tw, variantProps } from "classname-variants/react";

type AvatarProps = {
  url: string;
};

const avatarProps = variantProps({
  variants: {
    rounded: {
      none: tw`rounded-none`,
      xl: tw`rounded-xl`,
      full: tw`rounded-full`,
    },
    size: {
      small: tw`h-8 w-8`,
      medium: tw``,
      large: tw``,
    },
  },
  defaultVariants: {
    rounded: "none",
    size: "small",
  },
});

const Avatar = (props: AvatarProps) => {
  const { url } = props;
  return (
    <div {...avatarProps({ ...props })}>
      <Image alt="avatar" src={url} />
    </div>
  );
};

export default Avatar;
