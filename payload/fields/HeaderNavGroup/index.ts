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
      name: 'isMultiColumn',
      label: 'Is Multi Column',
      type: 'checkbox',
      admin: {
        description:
          'Enable this option if you want the links to be displayed in multiple columns in the dropdown menu.',
      },
      required: false,
      defaultValue: false,
    },
    {
      name: 'links',
      label: 'Links',
      type: 'array',
      fields: [link()],
      maxRows: 6,
      validate: (links, { siblingData }) => {
        debugger;
        if (!links || links.length === 0) return 'At least one link is required';
        return true;
      },
    },
  ],
};
