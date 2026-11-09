import type { CollectionConfig, OptionObject } from 'payload';

import { authenticated } from '@/payload/access/authenticated';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';
import { GROUP_LABELS } from '@/payload/constants';
import { logLoginActivity, rateLimitLogin } from './hooks';
import { isAdminUser } from '@/payload/access/isAdminUser';
import payload from 'payload';

const COLLECTIONS_LABELS = {
  media: 'Media',
  documents: 'Documents',
  artworks: 'Artworks',
  'board-members': 'Board Members',
  contributions: 'Contributions',
  artists: 'Artists',
  curators: 'Curators',
  art_orders: 'Art Orders',
  artist_proposals: 'Artist Proposals',
  hawk_projects: 'Hawk Projects',
  hawk_events: 'Hawk Events',
  member_projects: 'Member Projects',
  partners: 'Partners',
  newsletter_subscribers: 'Newsletter Subscribers',
  sponsors: 'Sponsors',
  pages: 'Pages',
  news: 'News',
  notifications: 'Notifications',
};

const IGNORE_COLLECTIONS = [
  'users',
  'media',
  'documents',
  'totp-attempts',
  'payload-mcp-api-keys',
  'payload-kv',
  'payload-jobs',
  'payload-locked-documents',
  'payload-migrations',
  'payload-preferences',
];
const IGNORE_GLOBALS = [
  'crowdfunding-settings',
  'artGallerySettings',
  'artGalleryNews',
  'main-page',
  'events-list',
  'projects-list',
  'news-list',
  'header',
  'footer',
];

const GLOBALS_LABELS = {
  'crowdfunding-settings': 'Crowdfunding Settings',
  artGallerySettings: 'Art Gallery Settings',
  artGalleryNews: 'Art Gallery News',
  'main-page': 'Main Page',
  'events-list': 'Events List',
  'projects-list': 'Projects List',
  'news-list': 'News List',
  header: 'Header',
  footer: 'Footer',
};

const collectionsToRef = (): OptionObject[] => {
  return Object.keys(payload.collections)
    .filter((collection) => !IGNORE_COLLECTIONS.includes(collection))
    .map((collection) => {
      const label = COLLECTIONS_LABELS[collection as keyof typeof COLLECTIONS_LABELS];
      return { label, value: collection };
    });
};

// const globalsToRef = (): OptionObject[] => {
//   return Object.keys(payload.globals)
//     .filter((global) => !IGNORE_GLOBALS.includes(global))
//     .map((global) => {
//       const label = GLOBALS_LABELS[global as keyof typeof GLOBALS_LABELS];
//       return { label, value: global };
//     });
// };

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
        condition: (_data, _siblingData, { user }) => isAdminUser(user),
      },
    },
    {
      name: 'permissions_collection',
      label: { en: 'Permissions', pt: 'Permissões' },
      type: 'array',
      minRows: 0,
      fields: [
        {
          name: 'collectionRef',
          type: 'array',
          minRows: 0,
          fields: [
            {
              name: 'collectionRef',
              type: 'select',
              label: { en: 'Collection', pt: 'Coleção' },
              required: true,
              unique: true,
              options: collectionsToRef(),
            },
            {
              name: 'permission',
              type: 'group',
              label: { en: 'Permission', pt: 'Permissão' },
              required: true,
              fields: [],

              // options: [
              //   { value: 'create', label: { en: 'Create', pt: 'Criar' } },
              //   { value: 'read', label: { en: 'Read', pt: 'Ler' } },
              //   { value: 'update', label: { en: 'Update', pt: 'Atualizar' } },
              //   { value: 'delete', label: { en: 'Delete', pt: 'Eliminar' } },
              // ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
};
