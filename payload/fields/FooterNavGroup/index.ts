import { Field } from 'payload';
import { link } from '../link';

export const FooterNavGroup: Field = {
  name: '',
  type: 'group',
  fields: [
    { name: 'title', type: 'text', required: false, localized: true },
    {
      name: 'Links',
      type: 'array',
      fields: [link({})],
      maxRows: 6,
    },
  ],
};
