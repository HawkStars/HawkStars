import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const FAQBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  imageAltText: 'FAQ Block',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Frequently Asked Questions',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
    },
    SectionID,
  ],
  labels: {
    plural: 'FAQ Blocks',
    singular: 'FAQ Block',
  },
};
