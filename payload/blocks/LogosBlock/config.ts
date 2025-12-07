import type { Block } from 'payload';

export const LogosBlock: Block = {
  slug: 'logosBlock',
  interfaceName: 'LogosBlock',
  fields: [
    {
      name: 'badgeText',
      type: 'text',
      required: false,
      localized: true,
      admin: { description: 'Text for the badge (e.g. Referral Partners)' },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Main heading' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      localized: true,
      admin: { description: 'Description text' },
    },
    {
      name: 'buttonText',
      type: 'text',
      required: false,
      localized: true,
      admin: { description: 'Button text (e.g. Become a partner)' },
    },
    {
      name: 'logos',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'text', required: true, admin: { description: 'Logo image URL' } },
      ],
      admin: { description: 'Partner logos' },
    },
  ],
  labels: {
    plural: 'Logos Blocks',
    singular: 'Logos Block',
  },
};
