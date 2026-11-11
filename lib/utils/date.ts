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

export { customDateRangeQuery };
