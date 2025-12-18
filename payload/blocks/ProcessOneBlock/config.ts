import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const ProcessOneBlock: Block = {
  slug: 'processOneBlock',
  interfaceName: 'ProcessOneBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      required: true,
      localized: false,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      localized: false,
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Call-to-Action Button Text',
      defaultValue: 'Get in touch',
      localized: false,
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Process Steps',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'step',
          type: 'text',
          label: 'Step Number (e.g., "01", "02")',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Step Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Step Description',
          required: true,
        },
      ],
    },
    SectionID,
  ],
  labels: {
    singular: 'Process One Block',
    plural: 'Process One Blocks',
  },
};
