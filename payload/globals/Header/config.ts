import type { GlobalConfig } from 'payload';
import { revalidateHeader } from './hooks/revalidateHeader';
import { link } from '@/payload/fields/link';

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
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
