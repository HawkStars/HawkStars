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
export function createRevalidateHooks(tag: string) {
  const afterChange: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
    // Autosave fires afterChange on every keystroke-batch. Nothing public changes
    // while a document is a draft that was never published, and revalidateTag(tag)
    // wipes every cached query sharing this tag site-wide — so skip those.
    const isDraft = doc?._status === 'draft';
    const wasPublished = previousDoc?._status === 'published';
    if (isDraft && !wasPublished) return doc;

    revalidateTag(tag, 'max');
    return doc;
  };

  const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
    revalidateTag(tag, 'max');
    return doc;
  };

  return { afterChange, afterDelete };
}
