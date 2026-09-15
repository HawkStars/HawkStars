import type { CollectionBeforeOperationHook } from 'payload';
import { APIError } from 'payload';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';

/**
 * Per-IP cap on login attempts, regardless of which account is being tried.
 *
 * Payload's `maxLoginAttempts`/`lockTime` (set on Users.auth) locks a single
 * *account* after too many failures — it does nothing to stop one attacker spraying
 * credentials across many different emails from one IP.
 *
 * This runs as `beforeOperation`, not `beforeLogin`. `beforeLogin` fires only *after*
 * the password has been verified, so it never saw a failed attempt — which is exactly
 * the traffic it was written to block. `beforeOperation` runs before the login
 * operation executes, so wrong passwords are counted too.
 */
export const rateLimitLogin: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation !== 'login') return args;

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

  return args;
};
