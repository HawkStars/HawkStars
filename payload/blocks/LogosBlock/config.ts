import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

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
      admin: { description: 'Text for the badge (e.g. Referral Partners)' },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Heading', pt: 'Título' },
      admin: { description: 'Main heading' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      localized: true,
      label: { en: 'Description', pt: 'Descrição' },
      admin: { description: 'Description text' },
    },
    {
      name: 'buttonText',
      type: 'text',
      required: false,
      localized: true,
      label: { en: 'Button Text', pt: 'Texto do Botão' },
      admin: { description: 'Button text (e.g. Become a partner)' },
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
        { name: 'logo', type: 'text', required: true, label: { en: 'Logo URL', pt: 'URL do Logótipo' }, admin: { description: 'Logo image URL' } },
      ],
      admin: {
        description: 'Partner logos',
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
