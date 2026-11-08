import { mcpPlugin } from '@payloadcms/plugin-mcp';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';
import { uploadFileTool } from './mcpUploadTool';

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

  mcp: {
    // Base64 upload for files that are not online anywhere. Off by default: tick
    // "Upload File" under Tools on an API key to enable it for that key.
    tools: [uploadFileTool],
  },

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
      description:
        'Images used across the website, stored on Cloudinary. ' +
        'To add an image, call create with: `alt` (required, describes the image for accessibility), ' +
        '`filename` (with extension, e.g. "volunteers-pinhel.jpg") and `url` (a public HTTPS link ' +
        'to the image file). The server downloads the file from `url`; raw file contents cannot be ' +
        'sent. Allowed types: JPEG, PNG, WebP, AVIF, GIF. Allowed source hosts: hawkstars.org, ' +
        'drive.google.com, lh3.googleusercontent.com, res.cloudinary.com, images.unsplash.com — ' +
        'other hosts are rejected. Images wider than 2560px are scaled down. ' +
        'Update changes metadata (e.g. `alt`) only; it cannot replace the image.',
      enabled: {
        create: true,
        find: true,
        update: true,
        delete: false,
      },
    },
    documents: {
      description:
        'Downloadable files (PDF, Word, Excel, PowerPoint, CSV) linked from the website, stored on ' +
        'Google Drive. To add one, call create with: `title` (required), `filename` (with extension, ' +
        'e.g. "annual-report-2025.pdf"), `url` (a public HTTPS link to the file) and optionally ' +
        '`folder` (general, projects, events or reports) and `description`. The server downloads ' +
        'the file from `url`; raw file contents cannot be sent. Allowed source hosts: hawkstars.org, ' +
        'drive.google.com, docs.google.com — other hosts are rejected. A Google Drive file must be ' +
        'shared as "anyone with the link" and given as a direct download link ' +
        '(https://drive.google.com/uc?export=download&id=<FILE_ID>). ' +
        'Update changes metadata only; changing `folder` moves the file in Drive.',
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
    art_orders: {
      enabled: false,
    },
    artist_proposals: {
      enabled: false,
    },
    artworks: {
      enabled: false,
    },
    users: {
      enabled: false,
    },
    newsletter_subscribers: {
      enabled: false,
    },
    member_projects: {
      enabled: false,
    },
  },
  globals: {
    'crowdfunding-settings': {
      description: 'Settings for the crowdfunding page feature of the website.',
      enabled: {
        find: true,
        update: true,
      },
    },
    artGallerySettings: {
      description: 'Settings for the art gallery page feature of the website.',
      enabled: false,
    },
    artGalleryNews: {
      description: 'Settings for the art gallery news page feature of the website.',
      enabled: false,
    },
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
