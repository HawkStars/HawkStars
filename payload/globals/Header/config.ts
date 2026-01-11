import type { GlobalConfig } from 'payload';
import { anyone } from '@/payload/access/anyone';
import { dropdownNavLink } from '@/payload/fields/Link/DropdownNavLink';
import { link } from '@/payload/fields/link';

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: anyone,
  },
  admin: {
    description: `This is the information about the header. Each column represents a group of navigation links
      that will be displayed in the header section of the website side by side or at the mobile. If it has more just 1 link it will not have a dropdown`,
  },
  fields: [
    {
      required: true,
      name: 'columns',
      label: 'Header Navigation Columns',
      interfaceName: 'HeaderNavigationColumns',
      admin: {
        description: 'Configure the navigation columns for the header. topbar menus',
        components: {
          RowLabel: '@/payload/globals/Header/components/HeaderLabel',
        },
      },
      type: 'array',
      fields: [
        {
          name: 'isMultiColumn',
          label: 'Multi-Column Dropdown',
          type: 'checkbox',
          admin: {
            description:
              'Enable this option if you want the links to be displayed in multiple columns in the dropdown menu.',
            position: 'sidebar',
          },
          required: false,
          defaultValue: false,
        },
        link({
          localizedLabel: true,
          condition: (_, siblingData) => siblingData.isMultiColumn === false,
          description: 'Use this field if you want to have a single link without dropdown',
        }),
        {
          name: 'dropdown',
          label: 'Dropdown Content',
          admin: {
            description: 'Content for the dropdown menu when multiple links are present',
            condition: (_, siblingData) => {
              return siblingData.isMultiColumn === true;
            },
            hideGutter: true,
          },
          interfaceName: 'NavbarDropdown',
          type: 'group',
          fields: [
            {
              name: 'version',
              label: 'Version',
              type: 'select',
              options: [
                {
                  label: 'Version 1',
                  value: 'v1',
                },
                {
                  label: 'Version 2',
                  value: 'v2',
                },
              ],
              required: true,
              defaultValue: 'v1',
            },
            {
              name: 'dropdownTitle',
              type: 'text',
              label: 'Dropdown Title',
              required: true,
              localized: true,
              admin: { description: 'Title for the dropdown menu' },
            },
            {
              name: 'key',
              admin: {
                description: 'Unique key for the navigation group to be used on the dropdown menu',
                placeholder: 'menu-one',
              },
              type: 'text',
              required: true,
              unique: true,
              localized: false,
              validate: (value: string | undefined | null) => {
                if (!value || value.length === 0) return 'Key is required';
                // regex to check for only lowercase letters and no spaces
                if (!/^[a-zA-Z\-]+$/.test(value))
                  return 'Key needs to be always lowercase letters with no spaces';

                return true;
              },
            },
            {
              label: 'Navbar Dropdown Structure',
              type: 'group',
              admin: {
                hideGutter: true,
              },
              fields: [
                {
                  name: 'structure',
                  label: 'Structure',
                  type: 'select',
                  options: [
                    { label: 'Single Row', value: 'single-column' },
                    { label: 'Two Rows', value: 'two-columns' },
                  ],
                  required: true,
                  defaultValue: 'single-column',
                  admin: {
                    description: 'Select the structure for the dropdown menu',
                  },
                },
                {
                  name: 'links',
                  label: 'Dropdown Navigation Links',
                  type: 'group',
                  fields: [dropdownNavLink],
                  required: true,
                  admin: {
                    description: 'Dropdown Navigation Links for this entry',
                    hideGutter: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1000,
      },
    },
    max: 3,
  },
};
