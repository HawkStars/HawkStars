import { ArrayField } from 'payload';
import { link } from '../../link';
import { PayloadIconOrImage } from '../../ImageIcon';

export const dropdownNavLink: ArrayField = {
  name: 'dropdownNavLink',
  label: 'Dropdown Navigation Links',
  type: 'array',
  interfaceName: 'DropdownNavLink',
  admin: {
    isSortable: true,
    components: {
      RowLabel: '@/payload/fields/Link/components/LinkLabel',
    },
  },
  fields: [
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Link',
      required: false,
      admin: {
        description: 'Mark this link as featured to highlight it in the dropdown menu.',
      },
    },
    {
      name: 'visible',
      type: 'checkbox',
      label: 'Visible On the Header',
      required: false,
      defaultValue: true,
      admin: {
        description: 'Uncheck this to hide the link from the header dropdown menu.',
      },
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Image Position',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
      ],
      required: false,
    },
    { name: 'description', type: 'text', localized: true },
    link({ localizedLabel: true }),
    PayloadIconOrImage(),
  ],
};
