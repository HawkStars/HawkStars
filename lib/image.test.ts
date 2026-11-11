import { describe, expect, it } from 'vitest';
import type { Media } from '@/payload-types';
import { getMetaImage } from './image';

const media = {
  id: '690b080bd9ef49dec832db6d',
  url: 'https://res.cloudinary.com/demo/image/upload/v1/media/assentamentos.webp',
  alt: 'Assentamentos',
  width: 1297,
  height: 882,
} as Media;

describe('getMetaImage', () => {
  it('returns the populated Media from the polymorphic SEO image', () => {
    expect(getMetaImage({ image: { relationTo: 'media', value: media } })).toBe(media);
  });

  it('ignores an unpopulated relation (bare id) so callers fall back to their cover', () => {
    expect(getMetaImage({ image: { relationTo: 'media', value: media.id } })).toBeUndefined();
  });

  it('ignores a missing or empty share image', () => {
    expect(getMetaImage(undefined)).toBeUndefined();
    expect(getMetaImage(null)).toBeUndefined();
    expect(getMetaImage({ image: null })).toBeUndefined();
    expect(getMetaImage({})).toBeUndefined();
  });

  it('ignores a Media document without a url', () => {
    expect(
      getMetaImage({ image: { relationTo: 'media', value: { ...media, url: null } } })
    ).toBeUndefined();
  });
});
