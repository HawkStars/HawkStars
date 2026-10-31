import type { Payload, TypedLocale } from 'payload';

/**
 * Local API reads for the custom dashboard. These run with the default
 * `overrideAccess: true`, which is fine here: every collection read below is
 * editorial content that both account tiers can already read in the admin,
 * and only titles/dates are selected — nothing is handed to a client component.
 */

export type DashboardDoc = {
  id: string;
  collection: EditorialSlug;
  title: string;
  updatedAt: string;
  status?: 'draft' | 'published' | null;
};

export type UpcomingEvent = {
  id: string;
  heading: string;
  date: string;
  endDate?: string | null;
  location?: string | null;
};

type EditorialSlug = 'pages' | 'news' | 'hawk_projects' | 'hawk_events';

// Pages/News use `title`; Projects/Events use `heading` as their `useAsTitle`.
const TITLE_FIELD: Record<EditorialSlug, 'title' | 'heading'> = {
  pages: 'title',
  news: 'title',
  hawk_projects: 'heading',
  hawk_events: 'heading',
};

const HAS_DRAFTS: EditorialSlug[] = ['pages', 'news', 'hawk_projects'];

const findDocs = async (
  payload: Payload,
  collection: EditorialSlug,
  locale: TypedLocale | undefined,
  { limit, draftsOnly = false }: { limit: number; draftsOnly?: boolean }
): Promise<DashboardDoc[]> => {
  const titleField = TITLE_FIELD[collection];
  const hasDrafts = HAS_DRAFTS.includes(collection);

  const { docs } = await payload.find({
    collection,
    locale,
    depth: 0,
    limit,
    sort: '-updatedAt',
    pagination: false,
    where: draftsOnly ? { _status: { equals: 'draft' } } : undefined,
    select: { [titleField]: true, updatedAt: true, ...(hasDrafts && { _status: true }) },
  });

  return docs.map((doc) => {
    const record = doc as Record<string, unknown>;
    return {
      id: String(doc.id),
      collection,
      title: (record[titleField] as string | undefined) || 'Untitled',
      updatedAt: doc.updatedAt,
      status: (record._status as DashboardDoc['status']) ?? null,
    };
  });
};

const byUpdatedAtDesc = (a: DashboardDoc, b: DashboardDoc) =>
  new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

/** Most recently edited documents across the editorial collections. */
export const getRecentDocs = async (
  payload: Payload,
  locale: TypedLocale | undefined,
  limit = 8
): Promise<DashboardDoc[]> => {
  const results = await Promise.all(
    (Object.keys(TITLE_FIELD) as EditorialSlug[]).map((slug) =>
      findDocs(payload, slug, locale, { limit })
    )
  );
  return results.flat().sort(byUpdatedAtDesc).slice(0, limit);
};

/**
 * Documents that have never been published. A published document with a newer
 * unsaved draft keeps `_status: 'published'` on the main collection (the draft
 * lives in versions), so this lists only content that is not live at all.
 */
export const getDrafts = async (
  payload: Payload,
  locale: TypedLocale | undefined,
  limit = 8
): Promise<DashboardDoc[]> => {
  const results = await Promise.all(
    HAS_DRAFTS.map((slug) => findDocs(payload, slug, locale, { limit, draftsOnly: true }))
  );
  return results.flat().sort(byUpdatedAtDesc).slice(0, limit);
};

/** Events whose (end) date is today or later, soonest first. */
export const getUpcomingEvents = async (
  payload: Payload,
  locale: TypedLocale | undefined,
  limit = 5
): Promise<UpcomingEvent[]> => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const today = startOfToday.toISOString();

  const { docs } = await payload.find({
    collection: 'hawk_events',
    locale,
    depth: 0,
    limit,
    sort: 'date',
    pagination: false,
    // Multi-day events stay listed until their last day has passed.
    where: {
      or: [{ date: { greater_than_equal: today } }, { endDate: { greater_than_equal: today } }],
    },
    select: { heading: true, date: true, endDate: true, location: true },
  });

  return docs.map((doc) => ({
    id: String(doc.id),
    heading: doc.heading || 'Untitled',
    date: doc.date,
    endDate: doc.endDate,
    location: doc.location,
  }));
};
