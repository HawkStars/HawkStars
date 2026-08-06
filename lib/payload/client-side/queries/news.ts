import type { News, LatestNewsBlock } from '@/payload-types';
import type { Where } from 'payload';
import { stringify } from 'qs-esm';
import * as Sentry from '@sentry/nextjs';

import { getImagePayloadUrl } from '@/lib/image';

import { NewsTypeLabels } from '@/components/news/constants';
import API_CLIENT_PATHS from '../constants';

// --- LatestNewsBlock fetch helpers ---

export type LatestNewsItem = {
  heading: string;
  badge: string | null;
  date: string | null;
  description: string | null;
  image: { url: string; alt?: string } | null | undefined;
  href: string;
};

const eventTypeLabels: Record<string, string> = {
  erasmus: 'Erasmus +',
  local_event: 'Local Event',
  international_event: 'International Event',
  other: 'Other',
};

/**
 * Fetch the single most-recently-published news article, optionally filtered by type.
 */
const fetchLatestNews = async (
  newsType?: LatestNewsBlock['newsType']
): Promise<LatestNewsItem | null> => {
  const where: Where = {
    _status: { equals: 'published' },
  };

  if (newsType && newsType.length > 0) {
    where.type = { in: newsType };
  }

  const queryString = stringify(
    { where, limit: 1, sort: '-publishedAt' },
    { addQueryPrefix: true }
  );

  try {
    const response = await fetch(`${API_CLIENT_PATHS.news}${queryString}`, { method: 'GET' });

    if (!response.ok) return null;

    const result = await response.json();
    const doc: News = result.docs[0] ?? null;
    if (!doc) return null;

    return {
      heading: doc.title,
      badge: doc.type ? NewsTypeLabels[doc.type] || doc.type : null,
      date: doc.publishedAt ?? null,
      description: null,
      image: getImagePayloadUrl(doc.mainImage) ?? null,
      href: `/news/${doc.slug}`,
    };
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
};

/**
 * Fetch the most recently created hawk event, optionally filtered by event type.
 *
 * NOTE: previously this function incorrectly fetched from /api/news — it now
 * correctly targets /api/hawk_events.
 */
const fetchLatestHawkEvent = async (
  eventType?: LatestNewsBlock['eventType']
): Promise<LatestNewsItem | null> => {
  const where: Where = {};

  if (eventType && eventType.length > 0) where.type_event = { in: eventType };

  const queryString = stringify({ where, limit: 1, sort: '-createdAt' }, { addQueryPrefix: true });

  try {
    const response = await fetch(`${API_CLIENT_PATHS.events}${queryString}`, { method: 'GET' });

    if (!response.ok) {
      console.error('Failed to fetch latest hawk event:', response.statusText);
      return null;
    }

    const result = await response.json();
    const doc = result.docs[0] ?? null;
    if (!doc) return null;

    return {
      heading: doc.heading,
      badge: doc.type_event ? eventTypeLabels[doc.type_event] || doc.type_event : null,
      date: null,
      description: doc.description ?? null,
      image: getImagePayloadUrl(doc.image) ?? null,
      href: `/events/${doc.slug}`,
    };
  } catch (error) {
    console.error('Error fetching latest hawk event:', error);
    return null;
  }
};

export { fetchLatestNews, fetchLatestHawkEvent };
