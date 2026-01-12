import type { GlobalConfig } from 'payload';
import { FooterNavGroup } from '@/payload/fields/FooterNavGroup';
import { authenticatedEditor } from '@/payload/access/authenticatedEditor';
import { revalidateFooter } from './hooks/revalidateFooter';

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: authenticatedEditor,
  },
  admin: {
    description: `This is the information about the footer. Each column represents a group of navigation links
      that will be displayed in the footer section of the website side by side or at the mobile.`,
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
    afterChange: [revalidateFooter],
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
