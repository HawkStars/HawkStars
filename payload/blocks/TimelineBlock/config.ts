import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const TimelineBlock: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Our Journey',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'year',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'orientation',
      type: 'select',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
      ],
      defaultValue: 'vertical',
    },
    SectionID,
  ],
  labels: {
    plural: 'Timelines',
    singular: 'Timeline',
  },
};
