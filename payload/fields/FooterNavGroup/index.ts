import { GroupField } from 'payload';
import { link } from '../link';

export const FooterNavGroup: GroupField = {
  name: 'column',
  required: true,
  type: 'group',
  interfaceName: 'FooterNavGroup',
  admin: {
    description: 'Footer column. If there is only 1 link, it will be displayed without a title.',
    components: {
      Label: '@/payload/fields/FooterNavGroup/components/Label',
    },
  },
  fields: [
    { name: 'title', type: 'text', label: 'Title', required: false, localized: true },
    {
      name: 'data',
      label: 'Links',
      type: 'array',
      fields: [link()],
      maxRows: 6,
      minRows: 1,
      required: true,
      localized: false,
      admin: {
        components: {
          RowLabel: '@/payload/fields/Link/components/LinkLabel',
        },
      },
    },
  ],
};
