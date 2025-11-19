import { Field } from 'payload';
import { link } from '../link';

export const HeaderNavGroup: Field = {
  name: 'data',
  label: 'Links Group',
  type: 'group',
  fields: [
    {
      name: 'key',
      admin: { description: 'Unique key for the navigation group to be used on the dropdown menu' },
      type: 'text',
      required: true,
      unique: true,
      localized: false,
      validate: (value: string | undefined | null) => {
        if (!value || value.length === 0) return 'Key is required';
        // regex to check for only lowercase letters and no spaces
        if (!/^[a-zA-Z]+$/.test(value))
          return 'Key needs to be always lowercase letters with no spaces';

        return true;
      },
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      admin: {
        description:
          'The title of the navigation group to be used on the dropdown menu. Use it when you want to have the dropdown',
      },
      required: false,
      localized: true,
      defaultValue: '',
    },
    {
      name: 'links',
      label: 'Links',
      type: 'array',
      fields: [link()],
      maxRows: 6,
    },
  ],
};
