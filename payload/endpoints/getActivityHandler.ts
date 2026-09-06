import type { PayloadHandler } from 'payload';

const NOTIFICATIONS_COLLECTION = 'notifications' as const;

/**
 * GET /api/notifications
 * Returns the latest notifications with unread count.
 * Query params:
 *   - limit (number, default 20): max notifications to return
 *   - unreadOnly (string 'true'/'false', default 'false'): filter to unread only
 */
export const getActivityLogHandler: PayloadHandler = async (req) => {
  const { payload, user } = req;

  if (!user || !user.isAdmin) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(req.url || '', 'http://localhost');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100);
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true';

    const where = unreadOnly ? { read: { equals: false } } : undefined;

    const [notifications, unreadCount] = await Promise.all([
      payload.find({
        collection: NOTIFICATIONS_COLLECTION,
        sort: '-createdAt',
        limit,
        where,
        depth: 1, // populate the `actor` relationship so the UI can show who acted
      }),
      payload.count({
        collection: NOTIFICATIONS_COLLECTION,
        where: { read: { equals: false } },
      }),
    ]);

    return Response.json({
      notifications: notifications.docs,
      unreadCount: unreadCount.totalDocs,
      totalDocs: notifications.totalDocs,
    });
  } catch {
    return Response.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
};

/**
 * POST /api/notifications/mark-read
 * Marks notification(s) as read.
 * Body: { id: string } for single, or { all: true } for all
 */
export const markNotificationsReadHandler: PayloadHandler = async (req) => {
  const { payload, user } = req;

  if (!user || !user.isAdmin) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json?.();

    if (body?.all === true) {
      const unread = await payload.find({
        collection: 'notifications',
        where: { read: { equals: false } },
        limit: 500,
        pagination: false,
      });

      await Promise.all(
        unread.docs.map((notification) =>
          payload.update({
            collection: 'notifications',
            id: notification.id,
            data: { read: true },
          })
        )
      );

      return Response.json({ success: true, marked: unread.docs.length });
    }

    if (body?.id) {
      await payload.update({
        collection: 'notifications',
        id: body.id,
        data: { read: true },
      });

      return Response.json({ success: true, marked: 1 });
    }

    return Response.json({ error: 'Provide { id } or { all: true }' }, { status: 400 });
  } catch {
    return Response.json({ error: 'Failed to mark notifications' }, { status: 500 });
  }
};
