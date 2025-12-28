import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const QuoteHighlightBlock: Block = {
  slug: 'quoteHighlight',
  interfaceName: 'QuoteHighlightBlock',
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'authorTitle',
      type: 'text',
    },
    PayloadImageField({ label: 'Author Photo', name: 'authorPhoto', required: false }),
    {
      name: 'style',
      type: 'select',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'With Border', value: 'bordered' },
        { label: 'Highlighted', value: 'highlighted' },
      ],
      defaultValue: 'centered',
    },
    SectionID,
  ],
  labels: {
    plural: 'Quote Highlights',
    singular: 'Quote Highlight',
  },
};
