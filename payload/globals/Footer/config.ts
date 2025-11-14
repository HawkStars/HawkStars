import type { GlobalConfig } from 'payload';

import { revalidateFooter } from './hooks/revalidateFooter';
import { FooterNavGroup } from '@/payload/fields/FooterNavGroup';

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'Footer Columns',
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
    afterChange: [revalidateFooter],
  },
};
