import { getIcon } from '@/lib/icon';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { ImageIcon, LinkField } from '@/payload-types';
import { cn } from '@/lib/utils';

export type DropdownLinkField = {
  featured?: boolean | null;
  /**
   * Uncheck this to hide the link from the header dropdown menu.
   */
  visible?: boolean | null;
  imagePosition?: ('top' | 'center' | 'bottom' | '') | null;
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

  const imageInformation = imageIcon.image;
  if (!imageInformation) return null;

  const imageElement = getImagePayloadUrl(imageInformation);
  if (!imageElement?.url) return null;

  const imagePosition = link.imagePosition || 'top';

  return (
    <ImageMedia
      resource={imageInformation}
      alt={imageElement.alt}
      className={cn(
        'object-fill',
        {
          'object-top': imagePosition === 'top',
          'object-center': imagePosition === 'center',
          'object-bottom': imagePosition === 'bottom',
          'object-cover': !imagePosition,
        },
        className
      )}
      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      fill
    />
  );
};
