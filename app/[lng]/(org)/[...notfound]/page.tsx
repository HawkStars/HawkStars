import { notFound } from 'next/navigation';

/**
 * Catch-all for unmatched multi-segment paths under /[lng].
 *
 * Single-segment misses are handled by `[slug]/page.tsx`, which calls `notFound()`.
 * This route previously *rendered* a 404-looking page instead of calling it, so every
 * unmatched deep path — and every unsupported-locale redirect from
 * `withHandleInternalization` (/fr/news -> /pt/fr/news) — returned HTTP 200. Google
 * reports those as soft 404s, they consume crawl budget, and genuinely broken inbound
 * links never show up as 404s in analytics.
 *
 * `notFound()` renders the localized `(org)/not-found.tsx` with a real 404 status, so
 * the UI is unchanged and only the status code is corrected.
 */
export default function NotFoundCatchAll(): never {
  notFound();
}
