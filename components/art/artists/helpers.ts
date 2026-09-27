import { Language } from '@/i18n/settings';
import { Artwork } from '@/payload-types';
import { ART_CATEGORIES } from '@/payload/collections/ArtCollection/categories';

const relationId = (value: string | { id: string } | null | undefined) =>
  typeof value === 'string' ? value : value?.id;

/**
 * Groups artworks by their artist or curator id. The pages load the artworks
 * with their own query (images populated) instead of reading them through the
 * artists'/curators' `artworks` join, which does not populate the images.
 */
export function groupArtworksBy(artworks: Artwork[], field: 'artist' | 'curator') {
  const groups = new Map<string, Artwork[]>();
  for (const artwork of artworks) {
    const id = relationId(artwork[field]);
    if (!id) continue;
    groups.set(id, [...(groups.get(id) ?? []), artwork]);
  }
  return groups;
}

/**
 * An artist's disciplines are derived from the categories of their artworks,
 * in the canonical category order — there is no separate field to keep in sync.
 */
export function artworkDisciplines(artworks: Artwork[], lng: Language): string[] {
  const used = new Set(artworks.map((artwork) => artwork.category));
  return ART_CATEGORIES.filter((category) => used.has(category.value)).map(
    (category) => category.label[lng]
  );
}
