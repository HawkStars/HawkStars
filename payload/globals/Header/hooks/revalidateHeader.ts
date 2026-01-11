import type { GlobalAfterChangeHook } from 'payload';
import { revalidateTag } from 'next/cache';

export const HEADER_CACHE_TAG = 'hawk-header' as const;

export const revalidateHeader: GlobalAfterChangeHook = ({ doc }) => {
  revalidateTag(HEADER_CACHE_TAG, 'max');

  return doc;
};
