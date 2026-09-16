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

export function createRevalidateGlobalHook(slug: string): GlobalAfterChangeHook {
  return ({ doc }) => {
    revalidateTagIfInRequestScope(`global:${slug}`);
    return doc;
  };
}
