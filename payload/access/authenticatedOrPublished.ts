import type { Access } from 'payload';

/**
 * Public read access for a collection that has `versions.drafts` enabled.
 *
 * Payload's `draft: false` only stops the newest *draft version* being merged over
 * the top of a document — it does NOT exclude a document whose own `_status` is
 * `'draft'`. So a bare `anyone` read on a drafts-enabled collection publishes every
 * unsaved, unpublished and scheduled document at its public URL and over the REST
 * and GraphQL APIs.
 *
 * Signed-in users (any tier) see everything, so the admin panel and the
 * authenticated live-preview routes are unaffected. Anonymous callers get a query
 * constraint rather than a flat deny, so published documents still resolve.
 *
 * Only use this on collections that actually carry `_status` — on a collection
 * without drafts the constraint matches nothing and silently hides the lot.
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true;

  return { _status: { equals: 'published' } };
};
