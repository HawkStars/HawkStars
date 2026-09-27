import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb';
import { parsePrice } from '@/lib/art-gallery/pricing';

/**
 * Moves the artworks to the structured sale fields the gallery now relies on:
 * - `price_value` (number, € excl. VAT) is filled from the old free-text,
 *   localized `price` ("2.500 euros.", "2100€* (sem moldura)"…), which is then
 *   removed — the text field no longer exists (kept only if it can't be read);
 * - `edition_size` is read from the edition text ("10 exemplares, assinados…"
 *   → 10; no number → 1, a unique piece). The text itself stays as the new
 *   "Notas da Tiragem";
 * - `available_quantity` (copies remaining) restarts at the edition size, or 0
 *   for artworks already marked sold, and `is_sold` is derived from it;
 * - the old free-text `available_print_run` is removed;
 * - every artwork gets a catalogue `reference`.
 */

type Localized = string | Record<string, string | undefined> | undefined;

type LegacyArtwork = {
  _id: unknown;
  price?: Localized;
  price_value?: number | null;
  tiragem?: Localized;
  edition_size?: number | null;
  available_quantity?: number | null;
  reference?: string | null;
  is_sold?: boolean;
};

const localizedValues = (value: Localized): (string | undefined)[] =>
  typeof value === 'object' && value ? [value.pt, value.en] : [value];

const firstInteger = (texts: (string | undefined)[]) => {
  for (const text of texts) {
    const match = text?.match(/\d+/);
    if (match) return Number(match[0]);
  }
  return null;
};

const newReference = () =>
  `GA-${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 4)}`.toUpperCase();

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const db = payload.db.connection.db;
  if (!db) return;

  const artworks = db.collection<LegacyArtwork>('artworks');

  for (const doc of await artworks.find({}).toArray()) {
    const set: Partial<LegacyArtwork> = {};

    const [pricePt, priceEn] = localizedValues(doc.price);
    if (doc.price_value == null) {
      const parsed = parsePrice(pricePt) ?? parsePrice(priceEn);
      if (parsed != null) set.price_value = parsed;
      else if (pricePt || priceEn)
        payload.logger.warn(
          `Artwork ${String(doc._id)}: could not read a price from "${pricePt ?? priceEn}"`
        );
    }

    const editionSize = Math.max(
      1,
      doc.edition_size ?? firstInteger(localizedValues(doc.tiragem)) ?? 1
    );
    set.edition_size = editionSize;
    set.available_quantity = doc.is_sold ? 0 : editionSize;
    set.is_sold = set.available_quantity === 0;

    if (!doc.reference) set.reference = newReference();

    // Only drop the text price once a numeric price exists, so nothing is lost
    // for an artwork whose text could not be read (it is logged above).
    const hasPrice = (set.price_value ?? doc.price_value) != null;
    const unset: Record<string, ''> = { available_print_run: '' };
    if (hasPrice) unset.price = '';

    await artworks.updateOne({ _id: doc._id }, { $set: set, $unset: unset });
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  const db = payload.db.connection.db;
  if (!db) return;

  // The old text price and print-run texts are not restored (they were replaced
  // by `price_value` / `edition_size`); only the new fields are removed.
  await db
    .collection('artworks')
    .updateMany({}, { $unset: { edition_size: '', available_quantity: '', reference: '' } });
}
