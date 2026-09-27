import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb';

/**
 * The `curators` collection's two existing documents (Romy Castro, Sofia F.
 * Augusto) are credited as the `artist` on the two existing artworks — they
 * are both the gallery's curators AND artists with work in the collection.
 * The `artworks.artist` relationship field (labelled "Artist" all along) is
 * moving to a dedicated `artists` collection to match, freeing up `curators`
 * for its own collection so the two of them can also be entered there in
 * their curator capacity, and a new `artworks.curator` field can reference
 * that separately from `artworks.artist`.
 *
 * Payload registers an index on every configured collection at startup
 * (e.g. the `artists` collection's unique `slug`), which makes MongoDB
 * lazily create that collection even before any document is written to it.
 * If that already happened, drop the empty stand-in first so the rename has
 * a clear target — but only if it is actually empty, as a safety check
 * against ever discarding real data.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const db = payload.db.connection.db;
  if (!db) return;

  const existing = await db.listCollections({ name: 'curators' }).toArray();
  if (existing.length === 0) return;

  const targetExists = (await db.listCollections({ name: 'artists' }).toArray()).length > 0;
  if (targetExists) {
    const targetCount = await db.collection('artists').countDocuments();
    if (targetCount > 0) {
      throw new Error(
        `Refusing to rename 'curators' to 'artists': 'artists' already has ${targetCount} document(s).`
      );
    }
    await db.collection('artists').drop();
  }

  await db.renameCollection('curators', 'artists');
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  const db = payload.db.connection.db;
  if (!db) return;

  const existing = await db.listCollections({ name: 'artists' }).toArray();
  if (existing.length > 0) {
    await db.renameCollection('artists', 'curators');
  }
}
