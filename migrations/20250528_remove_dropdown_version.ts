import { type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-mongodb';

export async function up({ payload, session }: MigrateUpArgs): Promise<void> {
  // Remove the `version` field from all dropdown objects in the header global
  const headerCollection = payload.db.globals.collection;

  await headerCollection.updateMany(
    { globalType: 'header' },
    {
      $unset: {
        'columns.$[].dropdown.version': '',
      },
    },
    { session },
  );

  payload.logger.info('Removed dropdown.version from header global documents.');

  // Also clean up versioned copies
  const headerVersionsCollection = payload.db.versions['_globals'].collection;

  await headerVersionsCollection.updateMany(
    { 'version.globalType': 'header' },
    {
      $unset: {
        'version.columns.$[].dropdown.version': '',
      },
    },
    { session },
  );

  payload.logger.info('Removed dropdown.version from header global version documents.');
}

export async function down({ payload, session }: MigrateDownArgs): Promise<void> {
  // Re-add version field with default 'v1' to all dropdowns
  const headerCollection = payload.db.globals.collection;

  await headerCollection.updateMany(
    { globalType: 'header', 'columns.dropdown': { $exists: true } },
    {
      $set: {
        'columns.$[].dropdown.version': 'v1',
      },
    },
    { session },
  );

  payload.logger.info('Restored dropdown.version to v1 on header global documents.');

  const headerVersionsCollection = payload.db.versions['_globals'].collection;

  await headerVersionsCollection.updateMany(
    { 'version.globalType': 'header', 'version.columns.dropdown': { $exists: true } },
    {
      $set: {
        'version.columns.$[].dropdown.version': 'v1',
      },
    },
    { session },
  );

  payload.logger.info('Restored dropdown.version to v1 on header global version documents.');
}
