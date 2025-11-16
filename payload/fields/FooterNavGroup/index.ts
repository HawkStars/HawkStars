import { GroupField } from 'payload';
import { link } from '../link';

export const FooterNavGroup: GroupField = {
  name: 'column',
  required: true,
  type: 'group',
  admin: {
    description: 'Footer column. If there is only 1 link, it will be displayed without a title.',
  },
  fields: [
    { name: 'title', type: 'text', required: false, localized: true },
    {
      name: 'links',
      type: 'array',
      fields: [link()],
      maxRows: 6,
      minRows: 1,
    },
  ],
};
