import type { GlobalConfig } from 'payload';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';

export const WebsiteSettings: GlobalConfig = {
  slug: 'settings',
  label: 'Configurações / Settings',
  access: {
    read: authenticatedAdmin,
    update: authenticatedAdmin,
  },
  admin: {
    description: `This is the information about the settings. Each column represents a group of navigation links
      that will be displayed in the settings section of the website side by side or at the mobile.`,
  },
  fields: [
    {
      name: 'instagramToken',
      label: 'Instagram Access Token',
      type: 'text',
      admin: {
        description:
          'Access token for Instagram API to fetch posts for the Instagram feed. You can generate a token using the Instagram Graph API Explorer.',
      },
    },
  ],
  lockDocuments: {
    duration: 1000 * 60 * 5, // Lock documents for 5 minutes
  },
  hooks: {},
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    max: 3,
  },
};
