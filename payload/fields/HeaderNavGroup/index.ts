import { Field } from 'payload';
import { link } from '../link';

export const HeaderNavGroup: Field = {
  name: '',
  type: 'group',
  fields: [
    {
      name: 'Links',
      type: 'array',
      fields: [link({})],
      maxRows: 6,
    },
  ],
};
