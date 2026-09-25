import type { ArrayField } from 'payload';
import { PROFILE_LINK_PLATFORMS } from './profileLinkPlatforms';

/**
 * Social networks / website / blog of an artist or curator. Each entry becomes
 * a button on their public profile page.
 */
export const profileLinksField: ArrayField = {
  name: 'links',
  label: { en: 'Social Networks, Website & Blog', pt: 'Redes Sociais, Site & Blog' },
  labels: {
    singular: { en: 'Link', pt: 'Link' },
    plural: { en: 'Links', pt: 'Links' },
  },
  type: 'array',
  interfaceName: 'ProfileLinks',
  admin: {
    initCollapsed: false,
    description: {
      en: 'Optional. Each link is shown as a button on the public profile.',
      pt: 'Opcional. Cada link aparece como um botão no perfil público.',
    },
    components: {
      RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'platform',
          label: { en: 'Type', pt: 'Tipo' },
          type: 'select',
          required: true,
          defaultValue: 'website',
          options: PROFILE_LINK_PLATFORMS.map(({ value, label }) => ({ value, label })),
          admin: { width: '30%' },
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
          validate: (value: string | null | undefined) =>
            !value ||
            /^https?:\/\/\S+$/i.test(value) ||
            'O URL tem de começar por http:// ou https://',
          admin: { width: '70%', placeholder: 'https://' },
        },
      ],
    },
    {
      name: 'title',
      label: { en: 'Button Text (optional)', pt: 'Texto do Botão (opcional)' },
      type: 'text',
      localized: true,
      admin: {
        description: {
          en: 'Leave empty to use the type name (e.g. "Instagram").',
          pt: 'Deixe vazio para usar o nome do tipo (ex.: "Instagram").',
        },
      },
    },
  ],
};
