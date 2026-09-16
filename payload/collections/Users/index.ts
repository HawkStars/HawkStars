import type { CollectionConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';
import { GROUP_LABELS } from '@/payload/constants';
import { logLoginActivity, rateLimitLogin } from './hooks';

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
    // Omitting this defaulted it to `Boolean(user)` — the regular content tier —
    // so a non-admin could clear the lockout on an account being brute-forced
    // and erase the effect of `maxLoginAttempts` below.
    unlock: authenticatedAdmin,
  },
  admin: {
    defaultColumns: ['name', 'email', 'isAdmin', 'updatedAt'],
    useAsTitle: 'name',
    description: {
      en: 'Manage admin panel users. Every account can manage content; admins additionally manage users, settings, donations and deletions. Only admins can create new users.',
      pt: 'Gira os utilizadores do painel de administração. Todas as contas podem gerir conteúdo; os administradores gerem além disso utilizadores, definições, donativos e eliminações. Apenas os administradores podem criar novos utilizadores.',
    },
    group: {
      ...GROUP_LABELS.management,
    },
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30, // 30 days
    maxLoginAttempts: 5,
    // Milliseconds, not seconds — Payload computes `new Date(now + lockTime)`
    // and its own default is 600000 ("10 minutes"). This used to read
    // `60 * 60 * 24` with a comment claiming 24 hours; that is 86 seconds, which
    // is *weaker* than the framework default it was meant to tighten.
    // (`tokenExpiration` above genuinely is in seconds, which is what makes the
    // mix-up easy to miss.)
    lockTime: 1000 * 60 * 60 * 24, // 24 hours
    // httpOnly is always on internally in Payload (not configurable) — these
    // two were previously left unset, relying on Payload's implicit
    // NODE_ENV-based defaults instead of asserting them explicitly.
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  hooks: {
    afterLogin: [logLoginActivity],
    // maxLoginAttempts/lockTime above lock a single *account* — this caps attempts
    // per *IP* regardless of which account is targeted. It runs as beforeOperation
    // because beforeLogin fires only after a successful password check, so it never
    // saw the failed attempts it exists to block.
    beforeOperation: [rateLimitLogin],
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
          en: 'Admins have full access: users, settings, donations, and deleting content. Accounts without this can create, edit and publish content but not delete it.',
          pt: 'Os administradores têm acesso total: utilizadores, definições, donativos e eliminação de conteúdo. As contas sem esta opção podem criar, editar e publicar conteúdo mas não eliminá-lo.',
        },
        condition: (_data, _siblingData, { user }) => Boolean(user?.isAdmin),
      },
    },
  ],
  timestamps: true,
};
