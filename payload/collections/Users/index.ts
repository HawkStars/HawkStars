import type { CollectionConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    read: authenticated,
    create: authenticatedAdmin,
    delete: authenticatedAdmin,
    update: authenticatedAdmin,
  },
  admin: {
    defaultColumns: ['name', 'email', 'isAdmin', 'isEditor', 'updatedAt'],
    useAsTitle: 'name',
    description:
      'Manage admin panel users and their roles. Admins have full access; Editors can manage content but not users or settings. Only admins can create new users.',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30, // 30 days
    maxLoginAttempts: 5,
    lockTime: 60 * 60 * 24, // 24 hours
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    { type: 'checkbox', name: 'isAdmin', label: 'Is Admin', defaultValue: false },
    { type: 'checkbox', name: 'isEditor', label: 'Is Editor', defaultValue: false },
  ],
  timestamps: true,
};
