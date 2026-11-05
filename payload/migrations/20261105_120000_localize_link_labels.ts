import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb';

/**
 * Button labels from `linkGroup()` (CTA Banner, Call To Action, Campaign Countdown,
 * Donation Progress, Hero Slideshow, Hero with Background, Stats, the events/projects
 * list pages) and the Hero block's `ctaLink` become translatable. Their stored value
 * changes shape from a plain string to a locale-keyed object, so existing labels move
 * to Portuguese — the site's default — and English falls back to it until translated:
 *
 *   "Ver Mais"  ->  { pt: "Ver Mais" }
 *
 * Only data with no localized ancestor changes shape. Under a localized parent (the
 * `pages.layout` rich text, a localized rich-text field inside a block) Payload ignores
 * nested `localized` flags and keeps plain strings, so the walk never descends into a
 * locale-keyed object.
 *
 * Covered: `main-page.layout` (non-localized rich text), `pages.blocks` (non-localized
 * blocks field), `events-list.links` / `projects-list.links`, and every stored version
 * of those documents. Idempotent: an already-converted label is an object and skipped.
 */

const LOCALES = ['pt', 'en'];
const DEFAULT_LOCALE = 'pt';

type Json = unknown;
type JsonObject = Record<string, unknown>;

const isObject = (value: Json): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** `{ pt: …, en: … }` — the value of a localized field; everything under it is per-language. */
export const isLocaleKeyed = (value: JsonObject): boolean => {
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => LOCALES.includes(key));
};

/** A `link()` group: `{ type: 'custom' | 'reference', url?, reference?, label, … }`. */
const isLinkGroup = (value: JsonObject): boolean =>
  (value.type === 'custom' || value.type === 'reference') && 'label' in value;

type Transform = (label: Json) => Json;

const walk = (value: Json, transform: Transform): { value: Json; changed: number } => {
  if (Array.isArray(value)) {
    let changed = 0;
    const next = value.map((item) => {
      const result = walk(item, transform);
      changed += result.changed;
      return result.value;
    });
    return { value: next, changed };
  }
  if (!isObject(value) || isLocaleKeyed(value)) return { value, changed: 0 };

  let changed = 0;
  const next: JsonObject = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === 'label' && isLinkGroup(value)) {
      const converted = transform(child);
      if (converted !== child) changed += 1;
      next[key] = converted;
      continue;
    }
    const result = walk(child, transform);
    changed += result.changed;
    next[key] = result.value;
  }
  return { value: next, changed };
};

/** Plain-string labels → `{ pt: label }`. */
export const localizeLinkLabels = (value: Json) =>
  walk(value, (label) =>
    typeof label === 'string' && label !== '' ? { [DEFAULT_LOCALE]: label } : label
  );

/** Reverse of `localizeLinkLabels`: `{ pt, en }` → the Portuguese (or English) string. */
export const delocalizeLinkLabels = (value: Json) =>
  walk(value, (label) =>
    isObject(label) && isLocaleKeyed(label)
      ? ((label[DEFAULT_LOCALE] as string | undefined) ?? (label.en as string | undefined) ?? '')
      : label
  );

/** Where label-bearing data lives: collection, document filter, and the paths to convert. */
const TARGETS: { collection: string; filter: JsonObject; paths: string[] }[] = [
  { collection: 'globals', filter: { globalType: 'main-page' }, paths: ['layout'] },
  { collection: '_main-page_versions', filter: {}, paths: ['version.layout'] },
  { collection: 'pages', filter: {}, paths: ['blocks'] },
  { collection: '_pages_versions', filter: {}, paths: ['version.blocks'] },
  { collection: 'globals', filter: { globalType: 'events-list' }, paths: ['links'] },
  { collection: '_events-list_versions', filter: {}, paths: ['version.links'] },
  { collection: 'globals', filter: { globalType: 'projects-list' }, paths: ['links'] },
  { collection: '_projects-list_versions', filter: {}, paths: ['version.links'] },
];

const getPath = (doc: JsonObject, path: string): Json =>
  path.split('.').reduce<Json>((node, part) => (isObject(node) ? node[part] : undefined), doc);

const run = async (
  { payload }: MigrateUpArgs | MigrateDownArgs,
  convert: (value: Json) => { value: Json; changed: number }
) => {
  const db = payload.db.connection.db;
  if (!db) return;

  const existing = new Set((await db.listCollections().toArray()).map((c) => c.name));

  for (const { collection, filter, paths } of TARGETS) {
    if (!existing.has(collection)) continue;
    let documents = 0;
    let labels = 0;

    for await (const doc of db.collection(collection).find(filter)) {
      const $set: JsonObject = {};
      for (const path of paths) {
        const current = getPath(doc, path);
        if (current === undefined || current === null) continue;
        const { value, changed } = convert(current);
        if (changed > 0) {
          $set[path] = value;
          labels += changed;
        }
      }
      if (Object.keys($set).length > 0) {
        await db.collection(collection).updateOne({ _id: doc._id }, { $set });
        documents += 1;
      }
    }

    payload.logger.info(
      `[localize_link_labels] ${collection} ${JSON.stringify(filter)}: ${labels} label(s) in ${documents} document(s)`
    );
  }
};

export async function up(args: MigrateUpArgs): Promise<void> {
  await run(args, localizeLinkLabels);
}

export async function down(args: MigrateDownArgs): Promise<void> {
  await run(args, delocalizeLinkLabels);
}
