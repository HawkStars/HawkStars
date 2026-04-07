import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

export const SectionListBlock: Block = {
  slug: 'sectionListBlock',
  interfaceName: 'SectionListBlock',
  labels: {
    singular: 'Section List',
    plural: 'Section Lists',
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'ordered',
      type: 'checkbox',
      label: 'Ordered (numbered) list',
      defaultValue: false,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      required: true,
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          required: false,
          localized: true,
        },
      ],
    },
    SectionID,
  ],
};
