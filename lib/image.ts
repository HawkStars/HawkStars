import { ImageType, Media } from '@/payload-types';

// TODO change this to return alt text as well
const getImagePayloadUrl = (info: ImageType) => {
  if (info.imageType === 'external') return { url: info.externalImage || '', alt: info.alt || '' };

  if (typeof info.image === 'string') return { url: info.image, alt: info.alt || '' };

  const imageInfo = info.image as Media;
  return { url: (info.image as Media)?.url || '', alt: info.alt || '' };
};

export { getImagePayloadUrl };
