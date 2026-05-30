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
      label: { en: 'Title', pt: 'Título' },
      required: true,
      localized: true,
    },
    { name: 'subtitle', type: 'text', label: { en: 'Subtitle', pt: 'Subtítulo' }, localized: true },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    PayloadImageField({ name: 'image', label: 'Image' }),
    SectionID,
  ],
  labels: {
    plural: { en: 'Calls to Action', pt: 'Chamadas para Ação' },
    singular: { en: 'Call to Action', pt: 'Chamada para Ação' },
  },
};
