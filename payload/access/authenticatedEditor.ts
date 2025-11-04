import type { AccessArgs } from 'payload';
import type { User } from '@/payload-types';

type isAdminAuthenticated = (args: AccessArgs<User>) => boolean;

export const authenticatedEditor: isAdminAuthenticated = ({ req: { user } }) => {
  if (!user) return false;
  return !!user.isEditor;
};
