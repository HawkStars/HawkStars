import { Field } from 'payload';
import { link } from '../link';

export const HeaderNavGroup: Field = {
  name: 'links',
  type: 'group',
  fields: [
    {
      name: 'key',
      admin: { description: 'Unique key for the navigation group to be used on the dropdown menu' },
      type: 'text',
      required: true,
      localized: false,
      validate: (value: string | undefined | null) => {
        if (!value || value.length === 0) return 'Key is required';
        // regex to check for only lowercase letters and no spaces
        if (!/^[a-z]+$/.test(value))
          return 'Key needs to be always lowercase letters with no spaces';

        return true;
      },
    },
    {
      name: 'Links',
      type: 'array',
      fields: [link()],
      maxRows: 6,
    },
  ],
};
