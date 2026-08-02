import type { BasePayload } from 'payload';
import * as Sentry from '@sentry/nextjs';

const NOTIFICATION_COLLECTION = 'notifications' as const;

/**
 * Where an activity-log entry came from: either a real collection slug, or one
 * of the non-collection event kinds (a login, an inbound message, anything else).
 */
export type NotificationSource =
  | 'hawk_projects'
  | 'hawk_events'
  | 'news'
  | 'pages'
  | 'artworks'
  | 'media'
  | 'contributions'
  | 'member_projects'
  | 'login'
  | 'message'
  | 'other';

/** Mirrors the `situation` select options on the Notification collection. */
export type NotificationSituation = 'login' | 'create' | 'update' | 'delete' | 'message' | 'other';

/** Sources that are not collections, so they get no derived link or relation. */
const NON_COLLECTION_SOURCES: readonly NotificationSource[] = ['login', 'message', 'other'];

const isCollectionSource = (source: NotificationSource) => !NON_COLLECTION_SOURCES.includes(source);

/**
 * Human-readable action label per source. Falls back to `DEFAULT_ACTION_LABELS`
 * for any pair not listed here, so a new situation never renders as `undefined`.
 */
const ACTION_LABELS: Record<NotificationSource, Partial<Record<NotificationSituation, string>>> = {
  hawk_projects: {
    create: 'New Project Created',
    update: 'Project Updated',
    delete: 'Project Deleted',
  },
  hawk_events: {
    create: 'New Event Created',
    update: 'Event Updated',
    delete: 'Event Deleted',
  },
  news: {
    create: 'News Article Created',
    update: 'News Article Published',
    delete: 'News Article Deleted',
  },
  pages: {
    create: 'New Page Created',
    update: 'Page Published',
    delete: 'Page Deleted',
  },
  artworks: {
    create: 'New Artwork Added',
    update: 'Artwork Updated',
    delete: 'Artwork Deleted',
  },
  media: {
    create: 'New Media Uploaded',
    update: 'Media Updated',
    delete: 'Media Deleted',
  },
  contributions: {
    create: 'New Contribution Received',
    update: 'Contribution Confirmed',
    delete: 'Contribution Deleted',
  },
  member_projects: {
    create: 'New Member Submission',
    update: 'Member Project Confirmed',
    delete: 'Member Project Deleted',
  },
  login: { login: 'User Logged In' },
  message: { message: 'New Message' },
  other: {},
};

const DEFAULT_ACTION_LABELS: Record<NotificationSituation, string> = {
  login: 'Logged In',
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  message: 'Message',
  other: 'Notification',
};

const resolveActionLabel = (source: NotificationSource, situation: NotificationSituation) =>
  ACTION_LABELS[source]?.[situation] ?? DEFAULT_ACTION_LABELS[situation];

type NotificationInput = {
  /** Collection slug the event belongs to, or a non-collection event kind. */
  collection: NotificationSource;
  situation: NotificationSituation;
  /** Subject of the entry — usually the document title. Suffixed with the action label. */
  title: string;
  message?: string;
  /** ID of the acting user, if any. Anonymous and system events leave this empty. */
  actor?: string | null;
  /** ID of the document the event refers to. Drives the admin link and relation. */
  docId?: string | number | null;
  /** Overrides the derived `/admin/collections/<slug>/<id>` link. */
  link?: string;
  /** Overrides the derived related-collection slug. */
  relatedCollection?: string;
};

/**
 * Writes a single entry to the activity log (`notifications`).
 *
 * Link and relation fields are derived from `collection` + `docId`, so callers
 * cannot drift them out of sync — pass `link` or `relatedCollection` only when
 * the derived value is genuinely wrong.
 *
 * Never throws: a failed log entry must not roll back the operation that
 * triggered it. Failures are reported to Sentry instead.
 */
const createNotification = async (
  payload: BasePayload,
  input: NotificationInput
): Promise<void> => {
  const { collection, situation, title, message, actor, docId, link, relatedCollection } = input;

  try {
    const derivable = isCollectionSource(collection) && docId != null;

    await payload.create({
      collection: NOTIFICATION_COLLECTION,
      data: {
        title: `${title} - ${resolveActionLabel(collection, situation)}`,
        message,
        situation,
        actor: actor ?? undefined,
        link: link ?? (derivable ? `/admin/collections/${collection}/${docId}` : undefined),
        relatedCollection: relatedCollection ?? (derivable ? collection : undefined),
        relatedDocId: derivable ? String(docId) : undefined,
      },
    });
  } catch (error) {
    console.error(`Failed to create ${collection}/${situation} notification:`, error);
    Sentry.captureException(error, {
      tags: { area: 'notifications', source: collection, situation },
    });
  }
};

export { createNotification };
export type { NotificationInput };
