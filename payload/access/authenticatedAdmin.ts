import type { Access } from 'payload';

export const authenticatedAdmin: Access = ({ req: { user } }) => {
  if (!user) return false;
  return !!user.isAdmin;
};
