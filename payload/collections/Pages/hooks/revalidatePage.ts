import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload';

import { revalidatePath } from 'next/cache';

import type { Page } from '@/payload-types';
import { languages } from '@/i18n/settings';

/**
 * Pages render at `/[lng]/[slug]` (and `/[lng]` for `home`), so a bare slug is
 * not a revalidatable path — every locale variant has to be invalidated.
 */
const pathsForSlug = (slug: Page['slug']) =>
  languages.map((lng) => (slug === 'home' ? `/${lng}` : `/${lng}/${slug}`));

const revalidateSlug = (payload: Payload, slug: Page['slug'], reason: string) => {
  for (const path of pathsForSlug(slug)) {
    payload.logger.info(`Revalidating ${reason} at path: ${path}`);
    revalidatePath(path, 'page');
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
