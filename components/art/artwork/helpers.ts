import type { TFunction } from 'i18next';
import type { Artist, Artwork, Curator, Media } from '@/payload-types';
import { getArtCategoryLabel } from '@/payload/collections/ArtCollection/categories';
import { formatDimensions } from '@/lib/art-gallery/dimensions';
import { transformUrl } from '@/utils/paths';

export const artworkUrl = (lng: string, artwork: Pick<Artwork, 'slug'>) =>
  transformUrl(lng, `/artwork/${artwork.slug}`);

export const artistUrl = (lng: string, artist: Pick<Artist, 'slug'>) =>
  transformUrl(lng, `/artist/${artist.slug}`);

export const curatorUrl = (lng: string, curator: Pick<Curator, 'slug'>) =>
  transformUrl(lng, `/curator/${curator.slug}`);

/** Relationship fields are `string` ids when not populated. */
export const populated = <T extends object>(value: T | string | null | undefined): T | null =>
  value && typeof value === 'object' ? value : null;

export const artworkImage = (artwork: Pick<Artwork, 'image'>) => populated<Media>(artwork.image);

/** "Vendida" / "Tiragem: 2 de 5" / "Peça Única" — the placard shown over artwork images. */
export function editionLabel(artwork: Artwork, t: TFunction) {
  if (artwork.is_sold) return t('edition.sold');
  const size = artwork.edition_size ?? 1;
  if (size <= 1) return t('edition.unique');
  return t('edition.remaining', { remaining: artwork.available_quantity ?? size, size });
}

/** "Pintura • 2024" — what the artwork cards show instead of editions and dimensions. */
export const categoryAndYear = (artwork: Artwork, lng: 'pt' | 'en') =>
  [getArtCategoryLabel(artwork.category, lng), artwork.year].filter(Boolean).join(' • ');

/** "Óleo sobre linho • 120 × 95 cm (sem moldura)", skipping whatever is missing. */
export const artworkSpecs = (artwork: Artwork, lng: 'pt' | 'en') =>
  [artwork.technique, formatDimensions(artwork, lng)].filter(Boolean).join(' • ');

type LexicalNode = { text?: string; children?: LexicalNode[] };

/** Flattens Payload/Lexical rich text into plain text, for short excerpts. */
export function richTextToPlain(data: unknown, maxLength?: number): string {
  const root = (data as { root?: LexicalNode } | null | undefined)?.root;
  if (!root) return '';

  const blocks: string[] = [];
  const collect = (node: LexicalNode): string =>
    node.text ?? (node.children ?? []).map(collect).join('');
  for (const child of root.children ?? []) blocks.push(collect(child));

  const text = blocks.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  if (!maxLength || text.length <= maxLength) return text;
  const cut = text.lastIndexOf(' ', maxLength);
  return `${text.slice(0, cut > 0 ? cut : maxLength)}…`;
}

const WORDS_PER_MINUTE = 200;

/** Estimated reading time of a rich text field, in whole minutes (at least 1). */
export const readingMinutes = (data: unknown) =>
  Math.max(
    1,
    Math.round(richTextToPlain(data).split(' ').filter(Boolean).length / WORDS_PER_MINUTE)
  );
