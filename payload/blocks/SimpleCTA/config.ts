import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const SimpleCTABlock: Block = {
  slug: 'simpleCta',
  interfaceName: 'SimpleCTABlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      localized: false,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
      localized: false,
    },
    {
      name: 'buttons',
      type: 'group',
      label: 'Buttons',
      fields: [
        {
          name: 'primary',
          type: 'group',
          label: 'Primary Button',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Button Text',
              localized: false,
            },
            {
              name: 'url',
              type: 'text',
              label: 'Button URL',
              required: false,
            },
          ],
        },
        {
          name: 'secondary',
          type: 'group',
          label: 'Secondary Button',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Button Text',
              localized: false,
            },
            {
              name: 'url',
              type: 'text',
              label: 'Button URL',
              required: false,
            },
          ],
        },
      ],
    },
    SectionID,
  ],
  labels: {
    plural: 'Simple CTAs',
    singular: 'Simple CTA',
  },
};
