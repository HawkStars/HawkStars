import { cn } from '@/lib/utils';
import { SerializedUploadNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';
import { Media } from '@/payload-types';
import { ImageMedia } from '../Media/ImageMedia';

const Upload: JSXConverter<SerializedUploadNode> = ({ node }) => {
  const { value } = node;
  const { url, alt, section, height, width } = value as unknown as Media;

  if (!url) return null;
  return (
    <ImageMedia
      data-section={section}
      resource={{ url, alt, height, width } as Media}
      alt={alt}
      pictureClassName={'flex justify-center my-4 rounded-lg'}
    />
  );
};

export default Upload;
