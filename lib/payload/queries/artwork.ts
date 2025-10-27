import { Artwork, Curator } from '@/payload-types';
import { getPayloadConfig } from '../client';
import { Language } from '@/i18n/settings';

export const getSingleArtwork = async (artworkID: string, locale: Language): Promise<Artwork> => {
  const payload = await getPayloadConfig();
  const artwork = await payload.findByID({ collection: 'artworks', id: artworkID, locale });
  return artwork;
};

export const getSingleCuratorQuery = async (slug: string, locale: Language): Promise<Curator> => {
  const payload = await getPayloadConfig();
  const curator = await payload.findByID({
    collection: 'curators',
    id: slug,
    locale,
  });
  return curator;
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
