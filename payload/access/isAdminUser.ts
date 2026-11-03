import type { PayloadRequest } from 'payload';
import type { PayloadMcpApiKey, User } from '@/payload-types';

/**
 * True when the request comes from an admin *person*. `req.user` can also be an
 * MCP API key (`payload-mcp-api-keys`), which has no `isAdmin` and is never an admin,
 * so narrow on the collection before reading the flag.
 */
export const isAdminUser = (
  user: PayloadRequest['user'] | undefined
): user is User | PayloadMcpApiKey => {
  if (!user) return false;
  if ('isAdmin' in user) {
    return Boolean(user.isAdmin);
  }

  const userReq = user as PayloadMcpApiKey;
  return Boolean((userReq.user as User)?.isAdmin) ?? false;
};
