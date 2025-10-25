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
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
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
