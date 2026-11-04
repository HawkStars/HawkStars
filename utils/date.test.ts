import { describe, expect, it } from 'vitest';
import { formatDate, formatDateRange } from './date';

describe('formatDate', () => {
  const iso = '2026-07-10T12:00:00.000Z';

  it('formats Payload ISO strings in the page language', () => {
    expect(formatDate(iso, 'pt')).toBe('10 de julho de 2026');
    expect(formatDate(iso, 'en')).toBe('July 10, 2026');
  });

  it('uses the site time zone, not the machine one (hydration-safe)', () => {
    // 23:30 UTC on the 9th is already the 10th in Lisbon (UTC+1 in summer).
    expect(formatDate('2026-07-09T23:30:00.000Z', 'pt')).toBe('10 de julho de 2026');
  });

  it('keeps plain dates on their day', () => {
    // Parsed as UTC midnight; west of UTC that used to show the previous day.
    expect(formatDate('2026-07-10', 'en')).toBe('July 10, 2026');
  });

  it('accepts custom options', () => {
    expect(formatDate(iso, 'en', { month: 'long', year: 'numeric' })).toBe('July 2026');
  });

  it('returns an empty string instead of "Invalid Date"', () => {
    expect(formatDate(null, 'pt')).toBe('');
    expect(formatDate('', 'pt')).toBe('');
    expect(formatDate('not a date', 'pt')).toBe('');
  });
});

// Intl uses thin/narrow no-break spaces around range dashes; compare on plain spaces.
const plain = (text: string) => text.replace(/\s/g, ' ');

describe('formatDateRange', () => {
  it('collapses ranges the way each language does', () => {
    expect(formatDateRange('2026-07-10T12:00:00Z', '2026-07-12T12:00:00Z', 'pt')).toBe(
      '10–12 de julho de 2026'
    );
    expect(plain(formatDateRange('2026-07-30T12:00:00Z', '2026-08-02T12:00:00Z', 'pt'))).toBe(
      '30 de julho – 2 de agosto de 2026'
    );
    expect(plain(formatDateRange('2026-07-10T12:00:00Z', '2026-07-12T12:00:00Z', 'en'))).toBe(
      'July 10 – 12, 2026'
    );
  });

  it('falls back to one date without an end, or on the same day', () => {
    expect(formatDateRange('2026-07-10T12:00:00Z', null, 'pt')).toBe('10 de julho de 2026');
    expect(formatDateRange('2026-07-10T09:00:00Z', '2026-07-10T18:00:00Z', 'pt')).toBe(
      '10 de julho de 2026'
    );
  });

  it('returns an empty string without a start', () => {
    expect(formatDateRange(null, '2026-07-12T12:00:00Z', 'pt')).toBe('');
  });
});
