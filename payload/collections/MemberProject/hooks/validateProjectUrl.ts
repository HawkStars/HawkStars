import type { CollectionBeforeChangeHook } from 'payload';
import type { MemberProject } from '@/payload-types';
import { isHttpUrl } from '@/utils/paths';

/**
 * Strips out any submitted URL that isn't http(s) — blocks `javascript:`/`data:`/etc
 * stored-XSS payloads on every write path (REST, GraphQL, admin, Local API), not just
 * the hardened app route's zod schema.
 *
 * Covers every user-suppliable URL field on this collection: `image_url`, `video_url`,
 * and each `dates[].link`.
 */
export const checkProjectUrl: CollectionBeforeChangeHook<MemberProject> = async ({ data }) => {
  if (!data) return data;

  const sanitized: Partial<MemberProject> = { ...data };

  if (data.image_url && !isHttpUrl(data.image_url)) {
    sanitized.image_url = undefined;
  }

  if (data.video_url && !isHttpUrl(data.video_url)) {
    sanitized.video_url = undefined;
  }

  if (Array.isArray(data.dates)) {
    sanitized.dates = data.dates.map((entry) =>
      entry?.link && !isHttpUrl(entry.link) ? { ...entry, link: undefined } : entry
    );
  }

  return { ...data, ...sanitized };
};
