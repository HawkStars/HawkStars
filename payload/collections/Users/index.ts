import type { CollectionConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { en: 'User', pt: 'Utilizador' },
    plural: { en: 'Users', pt: 'Utilizadores' },
  },
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
    group: {
      name: 'Management',
    },
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30, // 30 days
    maxLoginAttempts: 5,
    lockTime: 60 * 60 * 24, // 24 hours
  },
  fields: [
    {
      name: 'name',
      label: { en: 'Name', pt: 'Nome' },
      type: 'text',
    },
    {
      type: 'checkbox',
      name: 'isAdmin',
      label: { en: 'Is Admin', pt: 'É Administrador' },
      defaultValue: false,
      admin: {
        description: 'Admins have full access to all collections, globals, and settings.',
        condition: (data, { isAdmin }) => isAdmin === true,
      },
    },
    {
      type: 'checkbox',
      name: 'isEditor',
      label: { en: 'Is Editor', pt: 'É Editor' },
      defaultValue: false,
      admin: {
        description: 'Editors have access to manage content but cannot manage users or settings.',
        condition: (data, { isAdmin }) => isAdmin === true,
      },
    },
  ],
  timestamps: true,
};
