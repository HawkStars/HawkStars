/**
 * Day boundaries used to bucket events and projects into past/current/upcoming.
 *
 * Takes an explicit reference point so callers can compute it *outside* a
 * `'use cache'` scope and pass it in. Reading the clock inside a cached function
 * freezes "today" into the entry for the life of the cache (and trips Next's
 * "Date.now() during prerender" bailout), which is how `/events` ended up showing a
 * running event in the wrong bucket for up to an hour.
 */
const customDateRangeQuery = (reference: Date | string = new Date()) => {
  const now = typeof reference === 'string' ? new Date(reference) : reference;
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const nowIso = now.toISOString();

  return { startOfDay, endOfDay, now: nowIso };
};

/**
 * Hour-granular cache key. Passed as an argument to a cached query so the entry rolls
 * over every hour — matching `cacheLife('hours')` — instead of pinning a stale
 * "now" for the whole window. Returns a full ISO timestamp truncated to the hour.
 */
const currentTimeBucket = () => `${new Date().toISOString().slice(0, 13)}:00:00.000Z`;

export { customDateRangeQuery, currentTimeBucket };
