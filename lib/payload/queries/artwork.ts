// TODO: Replace with actual query when Payload CMS is set up

import { Artwork, Curator } from '@/payload-types';

export const getSingleArtwork = async () => {
  return null as unknown as Artwork;
};

export const getSingleCuratorQuery = async () => {
  return null as unknown as Curator;
};

export const getAllArtworkImagesQuery = async () => {
  return Promise.resolve([] as Artwork[]);
};

export const allArtwork = async () => {
  return Promise.resolve([] as Artwork[]);
};

export const allCuratorsQuery = async () => {
  return Promise.resolve([] as Curator[]);
};
