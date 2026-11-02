import type { PayloadRequest } from 'payload';
import type { User } from '@/payload-types';

/**
 * True when the request comes from an admin *person*. `req.user` can also be an
 * MCP API key (`payload-mcp-api-keys`), which has no `isAdmin` and is never an admin,
 * so narrow on the collection before reading the flag.
 */
export const isAdminUser = (
  user: PayloadRequest['user'] | undefined
): user is User & { collection: 'users' } => user?.collection === 'users' && Boolean(user.isAdmin);
