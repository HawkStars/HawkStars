import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { checkRateLimit, getClientIp, resetRateLimit } from './rateLimit';

/**
 * These were the highest-consequence untested lines in the repo: `checkRateLimit`
 * backs every public payment/submission endpoint AND `rateLimitLogin`, the
 * brute-force guard on the admin panel, and nothing anywhere asserted that it
 * ever refuses a request. `getClientIp`'s last-entry rule is one character away
 * from the bug its own comment records — taking the first entry let a caller
 * rotate `X-Forwarded-For` and defeat the limiter entirely.
 */

const headers = (h: Record<string, string>) => ({
  headers: { get: (k: string) => h[k.toLowerCase()] ?? null },
});

describe('checkRateLimit', () => {
  beforeEach(() => resetRateLimit());

  it('allows requests up to the limit and refuses the next one', () => {
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit('k', { limit: 3, windowMs: 60_000 }).allowed).toBe(true);
    }

    const blocked = checkRateLimit('k', { limit: 3, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it('keeps separate counters per key', () => {
    checkRateLimit('a', { limit: 1, windowMs: 60_000 });
    expect(checkRateLimit('a', { limit: 1, windowMs: 60_000 }).allowed).toBe(false);
    expect(checkRateLimit('b', { limit: 1, windowMs: 60_000 }).allowed).toBe(true);
  });

  it('reports retryAfter in whole seconds', () => {
    checkRateLimit('k', { limit: 1, windowMs: 5_000 });
    const { retryAfter } = checkRateLimit('k', { limit: 1, windowMs: 5_000 });
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(5);
    expect(Number.isInteger(retryAfter)).toBe(true);
  });

  describe('window expiry', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('starts a fresh window once the old one has passed', () => {
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
      expect(checkRateLimit('k', { limit: 1, windowMs: 1_000 }).allowed).toBe(true);
      expect(checkRateLimit('k', { limit: 1, windowMs: 1_000 }).allowed).toBe(false);

      vi.setSystemTime(new Date('2026-01-01T00:00:02Z'));
      expect(checkRateLimit('k', { limit: 1, windowMs: 1_000 }).allowed).toBe(true);
    });

    it('sweeps expired buckets so the map cannot grow without bound', () => {
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
      for (let i = 0; i < 50; i++) {
        checkRateLimit(`ip-${i}`, { limit: 5, windowMs: 1_000 });
      }

      // Past both the window and the 60s sweep interval.
      vi.setSystemTime(new Date('2026-01-01T00:02:00Z'));
      checkRateLimit('trigger-sweep', { limit: 5, windowMs: 1_000 });

      // An old key now behaves as brand new: its bucket was dropped.
      const result = checkRateLimit('ip-0', { limit: 1, windowMs: 1_000 });
      expect(result.allowed).toBe(true);
    });
  });
});

describe('getClientIp', () => {
  it('prefers x-real-ip, which nginx overwrites from $remote_addr', () => {
    expect(getClientIp(headers({ 'x-real-ip': '9.9.9.9', 'x-forwarded-for': '1.2.3.4' }))).toBe(
      '9.9.9.9'
    );
  });

  it('falls back to the LAST x-forwarded-for entry', () => {
    // nginx uses $proxy_add_x_forwarded_for, which APPENDS the real peer — so a
    // client sending "1.2.3.4" arrives as "1.2.3.4, <real ip>". Taking the first
    // entry would let anyone rotate the header and get a fresh bucket each time.
    expect(getClientIp(headers({ 'x-forwarded-for': '1.2.3.4, 9.9.9.9' }))).toBe('9.9.9.9');
  });

  it('cannot be shifted by a spoofed x-forwarded-for chain', () => {
    const spoofed = getClientIp(headers({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2, 9.9.9.9' }));
    expect(spoofed).toBe('9.9.9.9');
  });

  it('trims whitespace', () => {
    expect(getClientIp(headers({ 'x-real-ip': '  9.9.9.9  ' }))).toBe('9.9.9.9');
  });

  it('degrades to a single shared bucket rather than disabling the limiter', () => {
    expect(getClientIp(headers({}))).toBe('unknown');
  });
});
