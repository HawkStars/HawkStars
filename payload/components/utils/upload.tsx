import { SerializedUploadNode } from '@payloadcms/richtext-lexical';
import { JSXConverter } from '@payloadcms/richtext-lexical/react';
import { Media } from '@/payload-types';
import { ImageMedia } from '../Media/ImageMedia';
import * as Sentry from '@sentry/nextjs';

const Upload: JSXConverter<SerializedUploadNode> = ({ node }) => {
  const { value } = node;

  // When the upload relation is not depth-populated, `value` is just the ID
  // (string/number) rather than the Media object. Bail out gracefully.
  if (!value || typeof value !== 'object') {
    Sentry.captureException(
      new Error(
        'Upload node value is not an object. Ensure the upload relation is depth-populated.'
      ),
      {
        extra: {
          node,
          value,
        },
      }
    );

    return null;
  }

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
