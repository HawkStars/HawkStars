// TODO: Replace with actual query when Payload CMS is set up

import { Artwork, Curator } from '@/payload-types';
import { getPayloadConfig } from '../client';

export const getSingleArtwork = async (artworkID: string): Promise<Artwork> => {
  const payload = await getPayloadConfig();
  const artwork = await payload.findByID({ collection: 'artworks', id: artworkID });
  return artwork;
};

export const getSingleCuratorQuery = async (slug: string): Promise<Curator> => {
  const payload = await getPayloadConfig();
  const curator = await payload.findByID({
    collection: 'curators',
    id: slug,
  });
  return curator;
};

export const getAllArtworkImagesQuery = async () => {
  const payload = await getPayloadConfig();
  const artworks = await payload.find({ collection: 'artworks', limit: 100 });
  const { docs, hasNextPage, hasPrevPage, totalDocs, totalPages, nextPage } = artworks;
  return { docs, hasNextPage, hasPrevPage, totalDocs, totalPages, nextPage };
};

export const allArtwork = async () => {
  const payload = await getPayloadConfig();
  const artworks = await payload.find({ collection: 'artworks', limit: 100 });
  const { docs, hasNextPage, hasPrevPage, totalDocs, totalPages, nextPage } = artworks;
  return { docs, hasNextPage, hasPrevPage, totalDocs, totalPages, nextPage };
};

export const allCuratorsQuery = async () => {
  return Promise.resolve([] as Curator[]);
};
