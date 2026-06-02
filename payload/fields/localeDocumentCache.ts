'use client';

/**
 * Module-level cache for locale document data.
 * All ShowInput instances share a single fetch per document per locale,
 * instead of each field making its own request.
 */

const ALL_LOCALES = ['pt', 'en'] as const;
type LocaleCode = (typeof ALL_LOCALES)[number];

type CacheEntry = {
  promise: Promise<Record<string, unknown> | null>;
  doc: Record<string, unknown> | null;
  resolved: boolean;
};

type CacheProps = {
  globalSlug: string | undefined;
  collectionSlug: string | undefined;
  id: string | number | undefined;
  locale: string;
};

// Key format: "global:header:en" or "collection:pages:abc123:en"
const cache = new Map<string, CacheEntry>();
const listeners = new Set<() => void>();

function getCacheKey({ globalSlug, collectionSlug, id, locale }: CacheProps): string {
  if (globalSlug) return `global:${globalSlug}:${locale}`;
  return `collection:${collectionSlug}:${id}:${locale}`;
}

function fetchLocaleDoc({ globalSlug, collectionSlug, id, locale }: CacheProps): CacheEntry {
  const key = getCacheKey({ globalSlug, collectionSlug, id, locale });

  const existing = cache.get(key);
  if (existing) return existing;

  const endpoint = globalSlug
    ? `/api/globals/${globalSlug}?locale=${locale}&depth=0&draft=true`
    : `/api/${collectionSlug}/${id}?locale=${locale}&depth=0&draft=true`;

  const entry: CacheEntry = {
    promise: fetch(endpoint)
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => {
        entry.doc = doc;
        entry.resolved = true;
        notify();
        return doc;
      })
      .catch(() => {
        entry.doc = null;
        entry.resolved = true;
        notify();
        return null;
      }),
    doc: null,
    resolved: false,
  };

  cache.set(key, entry);
  return entry;
}

function notify() {
  listeners.forEach((fn) => fn());
}

/**
 * Get all other-locale documents for this document.
 * Returns cached data synchronously if available, otherwise triggers fetch.
 */
export function getOtherLocalesDocs(
  globalSlug: string | undefined,
  collectionSlug: string | undefined,
  id: string | number | undefined,
  currentLocale: string
): { loading: boolean; docs: Record<LocaleCode, Record<string, unknown> | null> } {
  if (!globalSlug && !id) {
    return {
      loading: false,
      docs: Object.fromEntries(ALL_LOCALES.map((l) => [l, null])) as Record<
        LocaleCode,
        Record<string, unknown> | null
      >,
    };
  }

  let loading = false;
  const docs = {} as Record<LocaleCode, Record<string, unknown> | null>;

  for (const loc of ALL_LOCALES) {
    if (loc === currentLocale) {
      docs[loc] = null; // current locale comes from useField, not the cache
      continue;
    }
    const entry = fetchLocaleDoc({ globalSlug, collectionSlug, id, locale: loc });
    if (!entry.resolved) loading = true;
    docs[loc] = entry.doc;
  }

  return { loading, docs };
}

/**
 * Subscribe to cache updates (for triggering re-renders).
 */
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Clear cache for a specific document (call on save/locale switch if needed).
 */
export function invalidate(
  globalSlug: string | undefined,
  collectionSlug: string | undefined,
  id: string | undefined
) {
  for (const loc of ALL_LOCALES) {
    cache.delete(getCacheKey({ globalSlug, collectionSlug, id, locale: loc }));
  }
  notify();
}

export { ALL_LOCALES };
export type { LocaleCode };
