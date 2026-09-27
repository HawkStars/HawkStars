// Shared by the purchase page (to show the total) and /api/art-gallery/order
// (to charge it), so the two can never disagree about what a buyer pays.

const roundCents = (value: number) => Math.round(value * 100) / 100;

export type ArtworkTotals = {
  base: number;
  vatRate: number;
  vat: number;
  total: number;
};

export function computeArtworkTotals(base: number, vatRate: number): ArtworkTotals {
  const vat = roundCents((base * vatRate) / 100);
  return {
    base: roundCents(base),
    vatRate,
    vat,
    total: roundCents(base + vat),
  };
}

export function formatEuro(value: number, lng: string, fractionDigits = 2) {
  return new Intl.NumberFormat(lng === 'en' ? 'en-IE' : 'pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/**
 * Reads a euro amount out of free text (used once, by the migration that
 * converted the old text price field): "1 200 €" → 1200, "1.200,50€" → 1200.5,
 * "2.500 euros." → 2500, "2100€* (sem moldura)" → 2100, "sob consulta" → null.
 * Only the first number in the text is used, so dimensions after it are ignored.
 */
export function parsePrice(text: unknown): number | null {
  if (typeof text !== 'string') return null;
  const match = text.match(/\d(?:[\d\s.,]*\d)?/);
  if (!match) return null;
  let s = match[0].replace(/\s/g, '');

  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  const decimalSep = lastComma > lastDot ? ',' : '.';
  const decimalIdx = Math.max(lastComma, lastDot);
  // A separator followed by exactly three digits is a thousands separator.
  const hasDecimals = decimalIdx !== -1 && s.length - decimalIdx - 1 !== 3;

  if (hasDecimals) {
    const thousandsSep = decimalSep === ',' ? '.' : ',';
    s = s.split(thousandsSep).join('');
    const idx = s.lastIndexOf(decimalSep);
    s = `${s.slice(0, idx).replace(/[.,]/g, '')}.${s.slice(idx + 1)}`;
  } else {
    s = s.replace(/[.,]/g, '');
  }

  const value = Number(s);
  return Number.isFinite(value) && value > 0 ? value : null;
}

type PurchasableArtwork = {
  is_sold?: boolean | null;
  price_value?: number | null;
  edition_size?: number | null;
  available_quantity?: number | null;
};

/** The artwork's base price in euros (excl. VAT), or null when it is "on request". */
export const artworkPrice = (artwork: PurchasableArtwork): number | null =>
  artwork.price_value || null;

export const isPurchasable = (artwork: PurchasableArtwork) =>
  !artwork.is_sold &&
  !!artworkPrice(artwork) &&
  (artwork.available_quantity ?? artwork.edition_size ?? 1) > 0;
