import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';
import { isHttpUrl } from '@/utils/paths';

export const LogosBlock: Block = {
  slug: 'logosBlock',
  interfaceName: 'LogosBlock',
  admin: {
    group: 'Social Proof',
  },
  fields: [
    {
      name: 'badgeText',
      type: 'text',
      required: false,
      localized: true,
      label: { en: 'Badge Text', pt: 'Texto do Distintivo' },
      admin: {
        description: {
          en: 'Text for the badge (e.g. Referral Partners)',
          pt: 'Texto para o distintivo (ex: Parceiros de Referência)',
        },
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Heading', pt: 'Título' },
      admin: { description: { en: 'Main heading', pt: 'Título principal' } },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      localized: true,
      label: { en: 'Description', pt: 'Descrição' },
      admin: { description: { en: 'Description text', pt: 'Texto de descrição' } },
    },
    {
      name: 'buttonText',
      type: 'text',
      required: false,
      localized: true,
      label: { en: 'Button Text', pt: 'Texto do Botão' },
      admin: {
        description: {
          en: 'Button text (e.g. Become a partner)',
          pt: 'Texto do botão (ex: Torne-se parceiro)',
        },
      },
    },
    {
      name: 'buttonLink',
      type: 'text',
      required: false,
      label: { en: 'Button Link', pt: 'Link do Botão' },
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.buttonText),
        description: {
          en: 'Where the button goes. A site path (/partners) or a full https:// URL.',
          pt: 'Destino do botão. Um caminho do site (/partners) ou um URL https:// completo.',
        },
      },
      validate: (value: string | string[] | null | undefined) => {
        if (typeof value !== 'string' || value.length === 0) return true;
        if (value.startsWith('/') || isHttpUrl(value)) return true;
        return 'Enter a site path (/partners) or a full http(s):// URL.';
      },
    },
    {
      name: 'logos',
      type: 'array',
      interfaceName: 'LogosBlockLogo',
      minRows: 1,
      required: true,
      label: { en: 'Logos', pt: 'Logótipos' },
      fields: [
        { name: 'name', type: 'text', required: true, label: { en: 'Name', pt: 'Nome' } },
        {
          name: 'logo',
          type: 'text',
          required: true,
          label: { en: 'Logo URL', pt: 'URL do Logótipo' },
          admin: { description: { en: 'Logo image URL', pt: 'URL do logótipo' } },
          // Rendered with `unoptimized`, so the value reaches the <img src> verbatim.
          validate: (value: string | string[] | null | undefined) =>
            typeof value === 'string' && isHttpUrl(value)
              ? true
              : 'Enter a full http(s):// image URL.',
        },
      ],
      admin: {
        description: { en: 'Partner logos', pt: 'Logótipos dos parceiros' },
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Logos Blocks', pt: 'Blocos de Logótipos' },
    singular: { en: 'Logos Block', pt: 'Bloco de Logótipos' },
  },
};
