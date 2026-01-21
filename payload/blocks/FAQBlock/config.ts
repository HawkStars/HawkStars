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
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
          localized: true,
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
