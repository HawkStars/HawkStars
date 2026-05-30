import type { CollectionConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';
import { GROUP_LABELS } from '@/payload/constants';

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
    description: {
      en: 'Manage admin panel users and their roles. Admins have full access; Editors can manage content but not users or settings. Only admins can create new users.',
      pt: 'Gira os utilizadores do painel de administração e as suas funções. Os administradores têm acesso total; os editores podem gerir conteúdo mas não utilizadores ou definições. Apenas os administradores podem criar novos utilizadores.',
    },
    group: {
      ...GROUP_LABELS.management,
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
        description: {
          en: 'Admins have full access to all collections, globals, and settings.',
          pt: 'Os administradores têm acesso total a todas as coleções, globais e definições.',
        },
        condition: (data, { isAdmin }) => isAdmin === true,
      },
    },
    {
      type: 'checkbox',
      name: 'isEditor',
      label: { en: 'Is Editor', pt: 'É Editor' },
      defaultValue: false,
      admin: {
        description: {
          en: 'Editors have access to manage content but cannot manage users or settings.',
          pt: 'Os editores podem gerir conteúdo mas não podem gerir utilizadores ou definições.',
        },
        condition: (data, { isAdmin }) => isAdmin === true,
      },
    },
  ],
  timestamps: true,
};
