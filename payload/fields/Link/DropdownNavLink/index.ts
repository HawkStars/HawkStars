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
    { name: 'featured', type: 'checkbox', label: 'Featured Link', required: false },
    { name: 'description', type: 'text', localized: true },
    link({ localizedLabel: true }),
    PayloadIconOrImage(),
  ],
};
