import type { CollectionBeforeLoginHook } from 'payload';
import { APIError } from 'payload';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';

/**
 * Payload's `maxLoginAttempts`/`lockTime` (set on Users.auth) locks a single
 * *account* after too many failures — it does nothing to stop one attacker
 * spraying credentials across many different emails from one IP, and it's
 * the only login-adjacent surface that wasn't already behind
 * `utils/rateLimit.ts` (donate/subscription/member-projects/instagram all
 * are). This adds a per-IP cap on login attempts regardless of which account
 * is being tried.
 */
export const rateLimitLogin: CollectionBeforeLoginHook = async ({ req }) => {
  const { allowed, retryAfter } = checkRateLimit(`login:${getClientIp(req)}`, {
    limit: 10,
    windowMs: 5 * 60_000,
  });

  if (!allowed) {
    throw new APIError(
      `Too many login attempts. Try again in ${retryAfter} seconds.`,
      429,
      undefined,
      true
    );
  }
};
