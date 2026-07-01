/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * The app runs as a single PM2 fork process behind Nginx, so a module-level
 * Map is shared across all requests and is sufficient to blunt abuse of the
 * public payment/submission endpoints (spamming the EasyPay gateway, mass
 * contribution inserts). If the app is ever scaled to multiple instances this
 * should be moved to a shared store (Redis).
 */

interface WindowState {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, WindowState>();

// Opportunistic cleanup so the Map can't grow unbounded from unique IPs.
let lastSweep = Date.now();
const SWEEP_INTERVAL_MS = 60_000;

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, state] of buckets) {
    if (state.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets (for a Retry-After header). */
  retryAfter: number;
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const state = buckets.get(key);

  if (!state || state.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (state.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((state.resetAt - now) / 1000) };
  }

  state.count += 1;
  return { allowed: true, retryAfter: 0 };
}

/** Test helper — clears all rate-limit state so suites don't bleed into each other. */
export function resetRateLimit(): void {
  buckets.clear();
}

/**
 * Best-effort client IP from the proxy headers set by Nginx. Falls back to a
 * shared bucket so a missing header degrades to a global limit rather than
 * silently disabling the limiter.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
