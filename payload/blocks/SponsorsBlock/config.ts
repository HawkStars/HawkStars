import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const SponsorsBlock: Block = {
  slug: 'sponsorsBlock',
  interfaceName: 'SponsorsBlock',
  admin: {
    group: 'Organization',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Our Sponsors',
      localized: true,
      admin: {
        description: 'Section heading displayed above the sponsors grid',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optional section description',
      },
    },
    {
      name: 'tier',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Gold', value: 'gold' },
        { label: 'Silver', value: 'silver' },
        { label: 'Bronze', value: 'bronze' },
      ],
      admin: {
        description:
          'Filter by sponsor tier. Leave empty to show all sponsors.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 12,
      min: 1,
      max: 50,
      admin: {
        description: 'Maximum number of sponsors to display',
      },
    },
    SectionID,
  ],
  labels: {
    singular: 'Sponsors Block',
    plural: 'Sponsors Blocks',
  },
};
