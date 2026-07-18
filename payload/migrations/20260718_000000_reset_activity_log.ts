import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb';

/**
 * Reset the activity log for a fresh start.
 *
 * The `notifications` collection was repurposed into the Activity Log (adding an
 * `actor` relationship and a `login` situation). The small amount of legacy
 * notification data has no lasting value and predates the actor field, so we
 * clear it out and let the log rebuild from real activity going forward.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.connection.collection('notifications').deleteMany({});
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Irreversible: cleared activity-log entries cannot be restored.
}
