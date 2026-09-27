import { describe, expect, it } from 'vitest';
import { artworkPrice, computeArtworkTotals, isPurchasable, parsePrice } from './pricing';

describe('computeArtworkTotals', () => {
  it('adds VAT to the base price', () => {
    expect(computeArtworkTotals(3700, 23)).toEqual({
      base: 3700,
      vatRate: 23,
      vat: 851,
      total: 4551,
    });
  });

  it('rounds to cents', () => {
    expect(computeArtworkTotals(99.99, 23).vat).toBe(23);
    expect(computeArtworkTotals(99.99, 23).total).toBe(122.99);
  });
});

describe('isPurchasable', () => {
  it('requires a price, stock and not being sold', () => {
    expect(isPurchasable({ price_value: 100, available_quantity: 1 })).toBe(true);
    expect(isPurchasable({ price_value: 100 })).toBe(true);
    expect(isPurchasable({ price_value: null })).toBe(false);
    expect(isPurchasable({ price_value: 100, available_quantity: 0 })).toBe(false);
    expect(isPurchasable({ price_value: 100, is_sold: true })).toBe(false);
  });

  it('has no price when price_value is empty', () => {
    expect(artworkPrice({ price_value: null })).toBeNull();
    expect(artworkPrice({ price_value: 0 })).toBeNull();
  });
});

describe('parsePrice (old text price, used by the migration)', () => {
  it.each([
    ['1 200 €', 1200],
    ['1.200€', 1200],
    ['1.200,50 €', 1200.5],
    ['1,200.50', 1200.5],
    ['850', 850],
    ['€ 3.700', 3700],
    ['2.500 euros.', 2500],
    ['2100€* (sem moldura)', 2100],
    ['1 500 € — 50 x 40 cm', 1500],
    ['sob consulta', null],
    [undefined, null],
  ])('%s → %s', (input, expected) => {
    expect(parsePrice(input)).toBe(expected);
  });
});
