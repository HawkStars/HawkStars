import { Artwork, Curator } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';

export const getSingleArtwork = async (slug: string, locale: Language): Promise<Artwork | null> => {
  try {
    const payload = await getPayloadConfig();
    const data = await payload.find({
      collection: 'artworks',
      locale,
      where: { slug: { equals: slug } },
    });

    const artwork = data.docs.length > 0 ? (data.docs[0] as Artwork) : null;
    return artwork;
  } catch (error) {
    console.error('Error fetching artwork:', error);
    return null;
  }
};

export const getSingleCuratorQuery = async (
  slug: string,
  locale: Language
): Promise<Curator | undefined> => {
  try {
    const payload = await getPayloadConfig();
    const curator = await payload.find({
      collection: 'curators',
      locale,
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    });

    return curator.docs[0] as Curator;
  } catch (error) {
    console.error('Error fetching curator:', error);
    return undefined;
  }
};

export const getAllArtworkImagesQuery = async (locale: Language) => {
  const payload = await getPayloadConfig();
  const artworks = await payload.find({ collection: 'artworks', limit: 100, locale });
  return artworks;
};

export const allArtwork = async (locale: Language) => {
  const payload = await getPayloadConfig();
  const artworks = await payload.find({ collection: 'artworks', limit: 100, locale });
  return artworks;
};

export const allCuratorsQuery = async (locale: Language) => {
  const payload = await getPayloadConfig();
  const curators = await payload.find({ collection: 'curators', limit: 100, locale });
  return curators;
};
