import type { Block } from 'payload';

import { linkGroup } from '../../fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import { PayloadImageField } from '@/payload/fields/ImageType';

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
    PayloadImageField({ name: 'image', label: 'Image' }),
    SectionID,
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
};
