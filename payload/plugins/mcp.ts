import { mcpPlugin } from '@payloadcms/plugin-mcp';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';

export const hawkMCPPlugin = mcpPlugin({
  disabled: false,
  userCollection: 'users',
  overrideApiKeyCollection: (collection) => ({
    ...collection,
    access: {
      ...collection.access,
      admin: authenticatedAdmin,
      read: authenticatedAdmin,
      create: authenticatedAdmin,
      update: authenticatedAdmin,
      delete: authenticatedAdmin,
    },
  }),

  collections: {
    pages: {
      description: 'Pages for the website.',
      enabled: {
        create: true,
        find: true,
        update: true,
        delete: false,
      },
    },
    hawk_events: {
      description: 'Events that are part of the HawkStars initiative.',
      enabled: {
        create: true,
        find: true,
        update: true,
        delete: false,
      },
    },
    hawk_projects: {
      description: 'Projects that are part of the HawkStars initiative.',
      enabled: {
        create: true,
        find: true,
        update: true,
        delete: false,
      },
    },
    news: {
      description: 'News articles and press releases about HawkStars and its projects.',
      enabled: {
        create: true,
        find: true,
        update: true,
        delete: false,
      },
    },
    notifications: {
      enabled: false,
    },
    partners: {
      description:
        'Partner organizations that support the HawkStars initiative or are doing projects together.',
      enabled: {
        create: true,
        find: true,
        update: true,
        delete: false,
      },
    },
    'board-members': {
      description: 'Board members of the HawkStars organization.',
      enabled: false,
    },
    contributions: {
      enabled: false,
    },
    artists: {
      enabled: false,
    },
    curators: {
      enabled: false,
    },
    media: {
      description: 'Media files uploaded to the website. Using Cloudinary as the storage provider.',
      enabled: {
        create: true,
        find: true,
        update: true,
        delete: false,
      },
    },
    documents: {
      description: 'Documents uploaded to the website. Using Google Drive as the storage provider.',
      enabled: {
        create: true,
        find: true,
        update: true,
        delete: false,
      },
    },
    sponsors: {
      description: 'Sponsors of the HawkStars initiative.',
      enabled: {
        create: true,
        find: true,
        update: true,
        delete: false,
      },
    },
  },
  globals: {
    'main-page': {
      description: 'Main/Index page of the website.',
      enabled: {
        find: true,
        update: true,
      },
    },
    'events-list': {
      description: 'Page with the list of HawkStars events and their details.',
      enabled: {
        find: true,
        update: true,
      },
    },
    'projects-list': {
      description: 'Page with the list of HawkStars projects and their details.',
      enabled: {
        find: true,
        update: true,
      },
    },
    'news-list': {
      description:
        'Page with the list of news articles and press releases about HawkStars and its projects.',
      enabled: {
        find: true,
        update: true,
      },
    },
    header: {
      enabled: false,
    },
    footer: {
      enabled: false,
    },
    settings: {
      enabled: false,
    },
  },
});
