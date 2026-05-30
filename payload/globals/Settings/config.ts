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
    description: {
      en: 'Configure website settings including Instagram feed access tokens and Google Drive integration.',
      pt: 'Configure as definições do website incluindo tokens de acesso ao feed do Instagram e integração com o Google Drive.',
    },
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
            description: {
              en: 'Access token for Instagram API to fetch posts for the Instagram feed. You can generate a token using the Instagram Graph API Explorer.',
              pt: 'Token de acesso à API do Instagram para obter publicações para o feed. Pode gerar um token usando o Instagram Graph API Explorer.',
            },
            readOnly: true,
          },
        },
        {
          name: 'instagramUserId',
          label: { en: 'Instagram User ID', pt: 'ID de Utilizador do Instagram' },
          type: 'text',
          admin: {
            description: {
              en: 'Numeric user ID for the Instagram Graph API. Use the "Fetch from token" button to resolve it automatically once the access token above is saved.',
              pt: 'ID de utilizador numérico para a API do Instagram. Use o botão "Obter do token" para o resolver automaticamente após guardar o token de acesso.',
            },
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
            description: {
              en: 'OAuth2 refresh token for Google API access. Automatically populated via the /api/google/refresh-token callback.',
              pt: 'Token de atualização OAuth2 para acesso à API do Google. Preenchido automaticamente via o callback /api/google/refresh-token.',
            },
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
