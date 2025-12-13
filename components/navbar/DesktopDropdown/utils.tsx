import Image from 'next/image';

import { getIcon } from '@/lib/icon';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageIcon, LinkField } from '@/payload-types';
import { cn } from '@/lib/utils';

export type DropdownLinkField = {
  featured?: boolean | null;
  description?: string | null;
  link: LinkField;
  imageIcon?: ImageIcon;
  id?: string | null;
};

export const getDropdownImageElement = (link: DropdownLinkField, className?: string) => {
  const imageIcon = link.imageIcon;
  if (!imageIcon) return null;
  const isIcon = imageIcon?.type === 'icon';

  if (isIcon) {
    const iconElement = getIcon(imageIcon.icon);
    if (!iconElement) return null;
    return iconElement;
  }

  const imageInformation = imageIcon.imageField;
  if (!imageInformation) return null;

  const imageElement = getImagePayloadUrl(imageInformation);
  if (!imageElement.url) return null;

  return (
    <Image
      src={imageElement.url}
      alt={imageElement.alt}
      fill
      className={cn('object-cover', className)}
    />
  );
};
