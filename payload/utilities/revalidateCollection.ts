import { revalidateTag } from 'next/cache';
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

/**
 * Generic afterChange/afterDelete hook pair for collections whose queries are
 * cached with Next's `'use cache'` directive and tagged via `cacheTag(tag)`
 * (see `lib/payload/queries/helpers.ts`'s `findPublishedCached`, which tags
 * every cached single-document lookup with the bare collection slug, and any
 * list-style query that opts in with the same tag).
 *
 * Without this, `News`, `HawkProject`, `HawkEvent`, `BoardMember`, `Partner`,
 * `Contribution`, `ArtCollection`, `Curator` and `MemberProject` had no way to
 * invalidate their cached queries on save/delete — editors had to wait out
 * the `cacheLife('hours')` window to see changes reflected, same underlying
 * bug as the Pages `revalidatePath` fix, just for the data-cache side instead
 * of the route-cache side. Mirrors the existing Header/Footer/MainPage
 * globals pattern (`revalidateTag(TAG, 'max')`).
 */
/**
 * `revalidateTag` requires Next's request-scoped store. Called from a cron tick
 * or a CLI script there is no store, and it throws
 * "Invariant: static generation store missing". Payload runs global afterChange
 * hooks *before* committing, so that throw aborted the whole write — which is
 * how the nightly supporters import could fail every run while looking like a
 * caching problem. Outside a request there is no per-request cache to
 * invalidate anyway, so swallowing it is correct rather than merely convenient.
 */
function revalidateTagIfInRequestScope(tag: string) {
  try {
    revalidateTag(tag, 'max');
  } catch {
    // no request scope — nothing to invalidate
  }
}

export function createRevalidateHooks(tag: string) {
  const afterChange: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
    // Autosave fires afterChange on every keystroke-batch. Nothing public changes
    // while a document is a draft that was never published, and revalidateTag(tag)
    // wipes every cached query sharing this tag site-wide — so skip those.
    const isDraft = doc?._status === 'draft';
    const wasPublished = previousDoc?._status === 'published';
    if (isDraft && !wasPublished) return doc;

    revalidateTagIfInRequestScope(tag);
    return doc;
  };

  const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
    revalidateTagIfInRequestScope(tag);
    return doc;
  };

  return { afterChange, afterDelete };
}
