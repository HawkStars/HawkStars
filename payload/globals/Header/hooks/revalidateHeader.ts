import type { GlobalAfterChangeHook } from 'payload';
import { safeRevalidateTag } from '@/payload/utilities/safeRevalidate';

export const HEADER_CACHE_TAG = 'hawk-header' as const;

export const revalidateHeader: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidateTag(HEADER_CACHE_TAG);
  return doc;
};
