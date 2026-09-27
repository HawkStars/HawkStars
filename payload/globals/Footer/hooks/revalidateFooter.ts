import type { GlobalAfterChangeHook } from 'payload';
import { safeRevalidateTag } from '@/payload/utilities/safeRevalidate';

export const FOOTER_CACHE_TAG = 'hawk-footer' as const;

export const revalidateFooter: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidateTag(FOOTER_CACHE_TAG);

  return doc;
};
