import { Field } from 'payload';
import { link } from '../link';

export const FooterNavGroup: Field = {
  name: '',
  type: 'group',
  fields: [
    {
      name: 'Links',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
};
