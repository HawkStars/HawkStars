import { safeRevalidateTag } from '@/payload/utilities/safeRevalidate';
import { GlobalAfterChangeHook } from 'payload';

export const MAIN_PAGE_CACHE_TAG = 'hawk-main-page' as const;

export const revalidateMainPage: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidateTag(MAIN_PAGE_CACHE_TAG);

  return doc;
};
