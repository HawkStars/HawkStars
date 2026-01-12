import type { GlobalAfterChangeHook } from 'payload';
import { revalidateTag } from 'next/cache';

export const FOOTER_CACHE_TAG = 'hawk-footer' as const;

export const revalidateFooter: GlobalAfterChangeHook = ({ doc }) => {
  revalidateTag(FOOTER_CACHE_TAG, 'max');

  return doc;
};
