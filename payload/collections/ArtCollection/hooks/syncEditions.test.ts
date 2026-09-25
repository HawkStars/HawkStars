import { describe, expect, it } from 'vitest';
import type { Artwork } from '@/payload-types';
import { syncEditions } from './syncEditions';

type HookArgs = Parameters<typeof syncEditions>[0];

const run = (data: Partial<Artwork>, originalDoc?: Partial<Artwork>) =>
  syncEditions({ data, originalDoc } as unknown as HookArgs) as Partial<Artwork>;

describe('syncEditions', () => {
  it('starts a new artwork with every copy available', () => {
    expect(run({ edition_size: 5 })).toMatchObject({ available_quantity: 5, is_sold: false });
  });

  it('only marks as sold out when no copies remain', () => {
    expect(run({ available_quantity: 1 }, { edition_size: 5 })).toMatchObject({ is_sold: false });
    expect(run({ available_quantity: 0 }, { edition_size: 5 })).toMatchObject({ is_sold: true });
  });

  it('clamps remaining copies to the edition size', () => {
    expect(run({ edition_size: 3, available_quantity: 10 })).toMatchObject({
      available_quantity: 3,
    });
    expect(run({ available_quantity: -2 }, { edition_size: 3 })).toMatchObject({
      available_quantity: 0,
      is_sold: true,
    });
  });

  it('treats a missing edition size as a unique piece', () => {
    expect(run({})).toMatchObject({ edition_size: 1, available_quantity: 1, is_sold: false });
  });
});
