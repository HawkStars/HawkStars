import type { GlobalConfig } from 'payload';
import { revalidateHeader } from './hooks/revalidateHeader';
import { link } from '@/payload/fields/link';
import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: anyone,
    create: authenticated,
    delete: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
};
