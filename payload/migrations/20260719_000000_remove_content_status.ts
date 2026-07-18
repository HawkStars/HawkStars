import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb';

/**
 * Remove the custom content-status workflow in favour of Payload's native
 * drafts/publish (`_status`).
 *
 *  - Drops the legacy `status` field (draft/in_review/published) from pages,
 *    news and hawk_projects.
 *  - hawk_projects just gained versions/drafts, so existing rows have no
 *    `_status`; backfill them as 'published' to keep them live.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const db = payload.db.connection;

  await Promise.all([
    db.collection('pages').updateMany({}, { $unset: { status: '' } }),
    db.collection('news').updateMany({}, { $unset: { status: '' } }),
    db.collection('hawk_projects').updateMany({}, { $unset: { status: '' } }),
  ]);

  // Backfill native status for hawk_projects that predate drafts.
  await db
    .collection('hawk_projects')
    .updateMany(
      { _status: { $exists: false } },
      { $set: { _status: 'published' } }
    );
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Irreversible: the legacy status values are not retained.
}
