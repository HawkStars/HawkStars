// TODO: Replace with actual query when Payload CMS is set up

import { Artwork, Curator } from '@/payload-types';
import { callPayloadAPI } from '../client';

export const getSingleArtwork = async () => {
  return null as unknown as Artwork;
};

export const getSingleCuratorQuery = async () => {
  return null as unknown as Curator;
};

export const getAllArtworkImagesQuery = async () => {
  const artworks = await callPayloadAPI('artworks');
  debugger;
  return artworks.docs;
};

export const allArtwork = async () => {
  return [];
};

export const allCuratorsQuery = async () => {
  return Promise.resolve([] as Curator[]);
};
