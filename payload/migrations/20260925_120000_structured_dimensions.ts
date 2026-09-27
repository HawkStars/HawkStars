import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb';

/**
 * Artwork dimensions move from free text ("77×54,5 cm (s/ moldura)",
 * "50cm de largura x 40 cm de altura.") to a type (unframed / framed / object)
 * plus numeric width / length / height in cm, so they are always shown the
 * same way. The old text is removed only when its numbers could be read.
 * The "Photo Settings" field no longer exists; its old values are left as they
 * are in the database (unused).
 */

type Localized = string | Record<string, string | undefined> | undefined;

type LegacyArtwork = {
  _id: unknown;
  dimensions?: Localized;
  framed_dimensions?: Localized;
  dimension_type?: string;
  width_cm?: number;
  length_cm?: number;
  height_cm?: number;
};

const firstText = (value: Localized) =>
  typeof value === 'object' && value ? (value.pt ?? value.en) : value;

/** "77×54,5 cm" → [77, 54.5] */
export const readNumbers = (text?: string) =>
  (text?.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => Number(n.replace(',', '.')));

export function parseDimensions(dimensions?: string, framedDimensions?: string) {
  const source = dimensions || framedDimensions;
  const numbers = readNumbers(source);
  if (numbers.length < 2) return null;

  const framed =
    (!dimensions && !!framedDimensions) || /c\/\s*moldura|com moldura|framed/i.test(source ?? '');
  if (numbers.length >= 3) {
    return {
      dimension_type: 'object',
      width_cm: numbers[0],
      length_cm: numbers[1],
      height_cm: numbers[2],
    };
  }
  return {
    dimension_type: framed ? 'framed' : 'unframed',
    width_cm: numbers[0],
    length_cm: numbers[1],
  };
}

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const db = payload.db.connection.db;
  if (!db) return;

  const artworks = db.collection<LegacyArtwork>('artworks');
  for (const doc of await artworks.find({}).toArray()) {
    if (doc.width_cm != null) continue;
    const parsed = parseDimensions(firstText(doc.dimensions), firstText(doc.framed_dimensions));
    if (!parsed) {
      if (doc.dimensions || doc.framed_dimensions) {
        payload.logger.warn(
          `Artwork ${String(doc._id)}: could not read dimensions, kept the old text`
        );
      }
      await artworks.updateOne({ _id: doc._id }, { $set: { dimension_type: 'unframed' } });
      continue;
    }
    await artworks.updateOne(
      { _id: doc._id },
      { $set: parsed, $unset: { dimensions: '', framed_dimensions: '' } }
    );
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  const db = payload.db.connection.db;
  if (!db) return;
  await db
    .collection('artworks')
    .updateMany({}, { $unset: { dimension_type: '', width_cm: '', length_cm: '', height_cm: '' } });
}
