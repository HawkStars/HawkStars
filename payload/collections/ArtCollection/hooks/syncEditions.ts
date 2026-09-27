import type { CollectionBeforeChangeHook } from 'payload';
import type { Artwork } from '@/payload-types';

/**
 * Keeps the edition fields consistent on every save:
 * - a new artwork starts with all copies remaining;
 * - remaining copies never exceed the edition size or go below 0;
 * - "Esgotada" (`is_sold`) is derived — true only when no copies remain.
 */
export const syncEditions: CollectionBeforeChangeHook<Artwork> = ({ data, originalDoc }) => {
  const editionSize = Math.max(1, data.edition_size ?? originalDoc?.edition_size ?? 1);
  const remaining = data.available_quantity ?? originalDoc?.available_quantity ?? editionSize;
  const available = Math.min(editionSize, Math.max(0, remaining));

  return {
    ...data,
    edition_size: editionSize,
    available_quantity: available,
    is_sold: available === 0,
  };
};
