import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb';

/**
 * The Image Showcase block was redesigned around a filmstrip, so its `gridColumns`
 * select (1 or 2 thumbnail columns) no longer exists. Payload ignores the stored
 * value, but it lingers in every saved block — this removes it.
 *
 * Image Showcase blocks can live in a page's `blocks` field, inside rich text
 * (`pages.layout`, `main-page.layout`, news content — as a lexical block node whose
 * `fields` carry the `blockType`), nested inside other blocks, under locale keys,
 * and in every stored version. Rather than enumerate those paths, the walk visits
 * every content document and strips `gridColumns` from any object whose
 * `blockType` is `imageShowcase`. Idempotent: a second run finds nothing.
 *
 * `down` is a no-op: the field has no schema to restore into.
 */

const BLOCK_TYPE = 'imageShowcase';
const STALE_FIELD = 'gridColumns';

type Json = unknown;
type JsonObject = Record<string, unknown>;

const isObject = (value: Json): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Returns a copy of `value` without `gridColumns` on Image Showcase blocks, plus how many were removed. */
export const dropGridColumns = (value: Json): { value: Json; changed: number } => {
  if (Array.isArray(value)) {
    let changed = 0;
    const next = value.map((item) => {
      const result = dropGridColumns(item);
      changed += result.changed;
      return result.value;
    });
    return { value: next, changed };
  }
  if (!isObject(value)) return { value, changed: 0 };

  const isShowcase = value.blockType === BLOCK_TYPE;
  let changed = 0;
  const next: JsonObject = {};
  for (const [key, child] of Object.entries(value)) {
    if (isShowcase && key === STALE_FIELD) {
      changed += 1;
      continue;
    }
    const result = dropGridColumns(child);
    changed += result.changed;
    next[key] = result.value;
  }
  return { value: changed > 0 ? next : value, changed };
};

/** Top-level keys that never hold content; skipped so `_id` etc. are not rewritten. */
const SKIP_KEYS = new Set(['_id', '__v', 'createdAt', 'updatedAt']);

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const db = payload.db.connection.db;
  if (!db) return;

  // Payload's own bookkeeping collections (`payload-migrations`, `payload-preferences`,
  // `payload-locked-documents`, jobs) never hold blocks.
  const collections = (await db.listCollections().toArray())
    .map((c) => c.name)
    .filter((name) => !name.startsWith('payload-') && !name.startsWith('system.'));

  let total = 0;

  for (const collection of collections) {
    let documents = 0;
    let removed = 0;

    for await (const doc of db.collection(collection).find({})) {
      const $set: JsonObject = {};
      for (const [key, current] of Object.entries(doc)) {
        if (SKIP_KEYS.has(key)) continue;
        const { value, changed } = dropGridColumns(current);
        if (changed > 0) {
          $set[key] = value;
          removed += changed;
        }
      }
      if (Object.keys($set).length > 0) {
        await db.collection(collection).updateOne({ _id: doc._id }, { $set });
        documents += 1;
      }
    }

    if (removed > 0) {
      payload.logger.info(
        `[drop_image_showcase_grid_columns] ${collection}: removed ${removed} value(s) in ${documents} document(s)`
      );
      total += removed;
    }
  }

  payload.logger.info(`[drop_image_showcase_grid_columns] done, ${total} value(s) removed`);
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info(
    '[drop_image_showcase_grid_columns] nothing to restore — gridColumns is no longer part of the schema'
  );
}
