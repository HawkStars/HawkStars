import { describe, expect, it } from 'vitest';
import { parseCountable } from './parseCountable';

describe('parseCountable', () => {
  it('reads plain and grouped integers, keeping their separator', () => {
    expect(parseCountable('90')).toMatchObject({ prefix: '', number: 90, suffix: '' });
    const en = parseCountable('30,342 km');
    expect(en).toMatchObject({ number: 30342, suffix: ' km' });
    expect(en?.format(1234)).toBe('1,234');
    expect(parseCountable('€24.500')?.format(24500)).toBe('24.500');
    expect(parseCountable('30 342')?.number).toBe(30342);
  });

  it('keeps a prefix and suffix', () => {
    expect(parseCountable('+1,400')).toMatchObject({ prefix: '+', number: 1400 });
    expect(parseCountable('90 tons')).toMatchObject({ number: 90, suffix: ' tons' });
    expect(parseCountable('100%')).toMatchObject({ number: 100, suffix: '%' });
  });

  it('refuses values that are not one clear count', () => {
    expect(parseCountable('2,5')).toBeNull();
    expect(parseCountable('1.5k')).toBeNull();
    expect(parseCountable('10-20')).toBeNull();
    expect(parseCountable('Thousands')).toBeNull();
    expect(parseCountable('0')).toBeNull();
    expect(parseCountable('2023')).toBeNull();
  });
});
