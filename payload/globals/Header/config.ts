import type { GlobalConfig } from 'payload';
import { revalidateHeader } from './hooks/revalidateHeader';
import { anyone } from '@/payload/access/anyone';
import { HeaderNavGroup } from '@/payload/fields/HeaderNavGroup';

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: anyone,
  },
  fields: [
    {
      name: 'Navigation Columns',
      admin: {
        components: {
          RowLabel: {
            path: '@/payload/globals/Header/components/HeaderLabel',
            exportName: 'HeaderLabel',
          },
        },
      },
      type: 'array',
      fields: [HeaderNavGroup],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
};
