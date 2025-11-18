import type { GlobalConfig } from 'payload';
import { FooterNavGroup } from '@/payload/fields/FooterNavGroup';

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'columns',
      label: 'Footer Columns',
      admin: {
        components: {
          RowLabel: {
            path: '@/payload/globals/Footer/components/FooterLabel',
            exportName: 'FooterLabel',
          },
        },
      },
      type: 'array',
      fields: [FooterNavGroup],
    },
  ],
  hooks: {
    afterChange: [],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1000,
      },
    },
    max: 3,
  },
};
