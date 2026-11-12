import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload';

import { safeRevalidatePath, safeRevalidateTag } from '@/payload/utilities/safeRevalidate';

import type { Page } from '@/payload-types';
import { languages } from '@/i18n/settings';

/**
 * Pages render at `/[lng]/[slug]` (and `/[lng]` for `home`), so a bare slug is
 * not a revalidatable path — every locale variant has to be invalidated.
 */
const pathsForSlug = (slug: Page['slug']) =>
  languages.map((lng) => (slug === 'home' ? `/${lng}` : `/${lng}/${slug}`));

const revalidateSlug = (payload: Payload, slug: Page['slug'], reason: string) => {
  // The page data itself sits in a `'use cache'` entry tagged `pages:<slug>`
  // (`findPublishedCached` in lib/payload/queries/helpers.ts). Revalidating the
  // path alone re-renders the route from that still-cached data, so an edit would
  // stay invisible until the entry's `cacheLife` ran out.
  safeRevalidateTag(`pages:${slug}`);
  for (const path of pathsForSlug(slug)) {
    payload.logger.info(`Revalidating ${reason} at path: ${path}`);
    safeRevalidatePath(path, 'page');
  }
};

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      revalidateSlug(payload, doc.slug, 'page');
    }

    // Unpublished, or the slug changed — the old path has to be dropped too.
    const wasPublished = previousDoc?._status === 'published';

    if (wasPublished && doc._status !== 'published') {
      revalidateSlug(payload, previousDoc.slug, 'unpublished page');
    } else if (wasPublished && previousDoc.slug !== doc.slug) {
      revalidateSlug(payload, previousDoc.slug, 'previous page slug');
    }
  }

  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    revalidateSlug(payload, doc.slug, 'deleted page');
  }

  return doc;
};
