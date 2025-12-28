import { ImageType, Media } from '@/payload-types';

const getImagePayloadUrl = (info: ImageType) => {
  if (info.imageType === 'external') return { url: info.externalImage || '', alt: info.alt || '' };
  if (typeof info.image === 'string') return { url: info.image, alt: info.alt || '' };

  const imageInfo = info.image as Media;
  if (!imageInfo) return { url: undefined, alt: undefined };

  return {
    url: imageInfo?.url || '',
    alt: info.alt || imageInfo.alt || '',
    width: imageInfo.width,
    height: imageInfo.height,
  };
};

export { getImagePayloadUrl };
