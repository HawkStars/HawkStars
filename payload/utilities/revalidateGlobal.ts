import { revalidateTag } from 'next/cache';
import type { GlobalAfterChangeHook } from 'payload';

/**
 * afterChange hook for globals read through `findGlobalCached`
 * (`lib/payload/queries/helpers.ts`), which tags every cached global read
 * `global:<slug>` with `cacheLife('hours')`.
 *
 * Header, Footer and MainPage each ship their own hook against their own tag
 * (`hawk-header`, `hawk-footer`, `hawk-main-page`). The remaining globals —
 * crowdfunding settings and the three listing-page configs — were cached under
 * the `global:*` namespace with nothing invalidating it, so an editor changing
 * the crowdfunding total or a listing header waited out the full hour.
 */
export function createRevalidateGlobalHook(slug: string): GlobalAfterChangeHook {
  return ({ doc }) => {
    revalidateTag(`global:${slug}`, 'max');
    return doc;
  };
}
