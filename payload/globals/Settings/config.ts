import type { GlobalConfig } from 'payload';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';

export const WebsiteSettings: GlobalConfig = {
  slug: 'settings',
  label: {
    pt: 'Configurações',
    en: 'Settings',
  },
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
      label: { en: 'Instagram Feed', pt: 'Feed do Instagram' },
      type: 'group',
      fields: [
        {
          name: 'instagramToken',
          label: { en: 'Instagram Access Token', pt: 'Token de Acesso do Instagram' },
          type: 'text',
          admin: {
            description:
              'Access token for Instagram API to fetch posts for the Instagram feed. You can generate a token using the Instagram Graph API Explorer.',
            readOnly: true,
          },
        },
        {
          name: 'instagramUserId',
          label: { en: 'Instagram User ID', pt: 'ID de Utilizador do Instagram' },
          type: 'text',
          admin: {
            description:
              'Numeric user ID for the Instagram Graph API. Use the "Fetch from token" button to resolve it automatically once the access token above is saved.',
          },
        },
      ],
    },
    {
      label: { en: 'Google Drive', pt: 'Google Drive' },
      type: 'group',
      fields: [
        {
          name: 'googleRefreshToken',
          label: { en: 'Google Refresh Token', pt: 'Token de Atualização do Google' },
          type: 'text',
          admin: {
            description:
              'OAuth2 refresh token for Google API access. Automatically populated via the /api/google/refresh-token callback.',
            readOnly: true,
            components: {
              afterInput: ['@/payload/globals/Settings/components/RefreshTokenButton'],
            },
          },
        },
      ],
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
