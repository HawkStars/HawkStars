import type { Block } from 'payload';

import { linkGroup } from '../../fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import { PayloadImageField } from '@/payload/fields/ImageType';

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  admin: {
    group: 'CTA & Engagement',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
    },
    { name: 'subtitle', type: 'text', label: 'Subtitle', localized: true },
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
