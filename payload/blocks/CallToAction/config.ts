import type { Block } from 'payload';

import { linkGroup } from '../../fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    { name: 'subtitle', type: 'text', label: 'Subtitle' },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    SectionID,
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
};
