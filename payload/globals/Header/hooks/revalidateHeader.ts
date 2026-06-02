import * as Sentry from '@sentry/nextjs';
import type { GlobalAfterChangeHook } from 'payload';
import { revalidateTag } from 'next/cache';

export const HEADER_CACHE_TAG = 'hawk-header' as const;

export const revalidateHeader: GlobalAfterChangeHook = ({ doc }) => {
  try {
    revalidateTag(HEADER_CACHE_TAG, 'max');
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        feature: 'header-cache-revalidation',
      },
    });
  }
  return doc;
};
