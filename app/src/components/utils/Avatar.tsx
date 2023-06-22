import Image from "next/image";
import { tw, variantProps } from "classname-variants/react";
import { BiUser } from "react-icons/bi";

type AvatarProps = {
  url: string;
  size?: "small" | "medium" | "large";
  rounded?: "none" | "xl" | "full";
};

/**
 * Props for the div on the avatar
 */
const avatarProps = variantProps({
  base: tw`relative`,
  variants: {
    rounded: {
      none: tw`rounded-none`,
      xl: tw`rounded-xl`,
      full: tw`rounded-full`,
    },
    size: {
      small: tw`h-8 w-8`,
      medium: tw`h-20 w-20`,
      large: tw`h-40 w-40`,
      xl: tw`h-96 w-96`,
    },
  },
  defaultVariants: {
    rounded: "full",
    size: "small",
  },
});

/**
 * Props for the image
 */
const imageAvatarProps = variantProps({
  variants: {
    rounded: {
      none: tw`rounded-none`,
      xl: tw`rounded-xl`,
      full: tw`rounded-full`,
    },
  },
  defaultVariants: {
    rounded: "full",
  },
});

const Avatar = (props: AvatarProps) => {
  const { url } = props;
  return (
    <div {...avatarProps({ ...props })}>
      {url ? (
        <Image
          alt="avatar"
          src={url}
          fill={true}
          {...imageAvatarProps({ ...props })}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div className="flex justify-center rounded-full bg-bege-dark p-2">
          <BiUser size={64} />
        </div>
      )}
    </div>
  );
};

export default Avatar;
