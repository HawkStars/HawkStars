'use client';
import Image from 'next/image';
import { tw, variantProps } from 'classname-variants/react';

import AvatarIcon from '@/public/images/icons/common/avatar.svg';
import { Media } from '@/payload-types';

type AvatarProps = {
  url?: string | Media | null;
  size?: 'small' | 'medium' | 'large';
  rounded?: 'none' | 'xl' | 'full';
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
    rounded: 'full',
    size: 'small',
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
    rounded: 'full',
  },
});

const Avatar = (props: AvatarProps) => {
  const { url } = props;

  return (
    <div {...avatarProps({ ...props })}>
      {!url && (
        <div className='bg-bege-dark flex justify-center rounded-full p-2'>
          <Image src={AvatarIcon} alt='Avatar' width={64} height={64} />
        </div>
      )}

      {url && (
        <>
          <Image
            alt='avatar'
            src={url as string}
            fill
            sizes='(max-width: 768px) 100px, (max-width: 1200px) 100px, 150px'
            {...imageAvatarProps({ ...props })}
            style={{ objectFit: 'cover' }}
          />
        </>
      )}
    </div>
  );
};

export default Avatar;
