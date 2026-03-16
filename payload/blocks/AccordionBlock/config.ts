import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const AccordionBlock: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlock',
  imageAltText: 'Accordion Block',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      localized: true,
      admin: {
        description: 'Optional title displayed above the accordion',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      localized: true,
      admin: {
        description: 'Optional description displayed below the title',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Accordion Items',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: 'Item Title',
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          localized: true,
          label: 'Item Content',
        },
        {
          name: 'defaultOpen',
          type: 'checkbox',
          label: 'Open by Default',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'allowMultiple',
      type: 'checkbox',
      label: 'Allow Multiple Open',
      defaultValue: false,
      admin: {
        description: 'Allow multiple accordion items to be open at the same time',
      },
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Style Variant',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Bordered', value: 'bordered' },
        { label: 'Separated', value: 'separated' },
      ],
    },
    SectionID,
  ],
  labels: {
    plural: 'Accordion Blocks',
    singular: 'Accordion Block',
  },
};
