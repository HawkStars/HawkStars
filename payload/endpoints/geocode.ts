import type { PayloadHandler } from 'payload';
import * as Sentry from '@sentry/nextjs';
import { checkRateLimit } from '@/utils/rateLimit';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Nominatim requires every caller to identify itself with a real User-Agent and
 * a contact address, and blocks generic ones. See the usage policy:
 * https://operations.osmfoundation.org/policies/nominatim/
 */
const CONTACT_EMAIL = process.env.GEOCODING_CONTACT_EMAIL || 'tech@hawkstars.org';
const USER_AGENT = `HawkStars/1.0 (+https://hawkstars.org; ${CONTACT_EMAIL})`;

/** Policy caps absolute usage at 1 req/sec across the whole application. */
const GLOBAL_LIMIT = { limit: 1, windowMs: 1_100 };
/** Politeness cap per editor, so one person cannot monopolise the global budget. */
const PER_USER_LIMIT = { limit: 20, windowMs: 60_000 };

const MIN_QUERY_LENGTH = 3;
const MAX_QUERY_LENGTH = 300;
const MAX_RESULTS = 5;
const FETCH_TIMEOUT_MS = 8_000;

export type GeocodeResult = {
  latitude: number;
  longitude: number;
  /** Full formatted address as Nominatim resolved it, for the editor to verify. */
  displayName: string;
  /** Nominatim's own confidence-ish ranking; higher is a better match. */
  importance: number | null;
};

type NominatimPlace = {
  lat?: string;
  lon?: string;
  display_name?: string;
  importance?: number;
};

/**
 * GET /api/geocode?q=<address>&lang=<pt|en>
 *
 * Server-side proxy to Nominatim (OpenStreetMap). It exists on the server rather
 * than in the admin bundle for two reasons: a browser `fetch` cannot set the
 * `User-Agent` the usage policy requires, and the rate limit has to be enforced
 * per-application rather than per-tab.
 *
 * Admin-only. Results are returned for the editor to confirm — nothing is
 * written to a document here.
 */
export const geocodeHandler: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const query = (req.searchParams?.get('q') ?? '').trim().replace(/\s+/g, ' ');
  const lang = req.searchParams?.get('lang') === 'en' ? 'en' : 'pt';

  if (query.length < MIN_QUERY_LENGTH || query.length > MAX_QUERY_LENGTH) {
    return Response.json(
      { error: `Query must be between ${MIN_QUERY_LENGTH} and ${MAX_QUERY_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const perUser = checkRateLimit(`geocode:user:${req.user.id}`, PER_USER_LIMIT);
  if (!perUser.allowed) {
    return Response.json(
      { error: 'Too many lookups. Wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(perUser.retryAfter) } }
    );
  }

  const global = checkRateLimit('geocode:global', GLOBAL_LIMIT);
  if (!global.allowed) {
    return Response.json(
      { error: 'Another lookup is in flight. Try again in a second.' },
      { status: 429, headers: { 'Retry-After': String(global.retryAfter) } }
    );
  }

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', String(MAX_RESULTS));
  url.searchParams.set('addressdetails', '0');
  // Also required by the usage policy, so heavy callers can be contacted.
  url.searchParams.set('email', CONTACT_EMAIL);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Language': lang === 'en' ? 'en,pt;q=0.8' : 'pt,en;q=0.8',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      // Nominatim data changes rarely and editors re-query the same addresses.
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      throw new Error(`Nominatim responded ${response.status}`);
    }

    const places = (await response.json()) as NominatimPlace[];

    const results: GeocodeResult[] = (Array.isArray(places) ? places : [])
      .map((place) => ({
        latitude: Number(place.lat),
        longitude: Number(place.lon),
        displayName: place.display_name ?? '',
        importance: typeof place.importance === 'number' ? place.importance : null,
      }))
      .filter((r) => Number.isFinite(r.latitude) && Number.isFinite(r.longitude) && r.displayName);

    return Response.json({ results });
  } catch (error) {
    req.payload.logger.error({ err: error, query }, 'Geocoding lookup failed');
    Sentry.captureException(error, { tags: { area: 'geocoding' } });

    return Response.json(
      { error: 'Geocoding service unavailable. Enter the coordinates manually.' },
      { status: 502 }
    );
  }
};

export default geocodeHandler;
