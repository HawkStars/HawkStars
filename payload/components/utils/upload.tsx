import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SerializedUploadNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';
import { Media } from '@/payload-types';

const Upload: JSXConverter<SerializedUploadNode> = ({ node }) => {
  const { value } = node;
  const { url, alt, section, height, width } = value as unknown as Media;

  if (!url) return null;
  return (
    <Image
      data-section={section}
      className={cn('mx-auto my-4 rounded-lg')}
      src={url}
      alt={alt}
      height={height || undefined}
      width={width || 1440}
    />
  );
};

export default Upload;
