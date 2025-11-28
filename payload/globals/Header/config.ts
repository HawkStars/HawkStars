import type { GlobalConfig } from 'payload';
import { anyone } from '@/payload/access/anyone';
import { HeaderNavGroup } from '@/payload/fields/HeaderNavGroup';

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: anyone,
  },
  admin: {
    description: `This is the information about the header. Each column represents a group of navigation links
      that will be displayed in the header section of the website side by side or at the mobile. If it has more just 1 link it will not have a dropdown`,
  },
  fields: [
    {
      required: true,
      name: 'columns',
      label: 'Header Navigation Columns',
      admin: {
        description: 'Configure the navigation columns for the header. topbar menus',
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
    afterChange: [],
  },
};
