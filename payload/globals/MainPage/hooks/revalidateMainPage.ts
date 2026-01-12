import { revalidateTag } from 'next/cache';
import { GlobalAfterChangeHook } from 'payload';

export const MAIN_PAGE_CACHE_TAG = 'hawk-main-page' as const;

export const revalidateMainPage: GlobalAfterChangeHook = ({ doc }) => {
  revalidateTag(MAIN_PAGE_CACHE_TAG, 'max');

  return doc;
};
