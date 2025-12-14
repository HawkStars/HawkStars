import type { Block } from 'payload';

export const PartnerShowcaseBlock: Block = {
  slug: 'partnerShowcase',
  interfaceName: 'PartnerShowcaseBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Our Partners',
    },
    {
      name: 'partners',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'website',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: 'Logos Only', value: 'logos' },
        { label: 'With Details', value: 'detailed' },
      ],
      defaultValue: 'logos',
    },
  ],
  labels: {
    plural: 'Partner Showcases',
    singular: 'Partner Showcase',
  },
};
