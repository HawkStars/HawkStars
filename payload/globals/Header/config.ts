import type { GlobalConfig } from 'payload';
import { anyone } from '@/payload/access/anyone';
import { dropdownNavLink } from '@/payload/fields/Link/DropdownNavLink';
import { link } from '@/payload/fields/link';
import { revalidateHeader } from './hooks/revalidateHeader';

export const Header: GlobalConfig = {
  slug: 'header',
  label: {
    pt: 'Cabeçalho',
    en: 'Header',
  },
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
      label: { en: 'Header Navigation Columns', pt: 'Colunas de Navegação do Cabeçalho' },
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
          label: { en: 'Multi-Column Dropdown', pt: 'Menu Suspenso Multi-Coluna' },
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
          label: { en: 'Dropdown Content', pt: 'Conteúdo do Menu Suspenso' },
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
              name: 'dropdownTitle',
              type: 'text',
              label: { en: 'Dropdown Title', pt: 'Título do Menu Suspenso' },
              required: true,
              localized: true,
              admin: { description: 'Title for the dropdown menu' },
            },
            {
              name: 'key',
              label: { en: 'Key', pt: 'Chave' },
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
              label: { en: 'Navbar Dropdown Structure', pt: 'Estrutura do Menu Suspenso' },
              type: 'group',
              admin: {
                hideGutter: true,
              },
              fields: [
                {
                  name: 'structure',
                  label: { en: 'Structure', pt: 'Estrutura' },
                  type: 'select',
                  options: [
                    { label: { en: 'Single Row', pt: 'Linha Única' }, value: 'single-column' },
                    { label: { en: 'Two Rows', pt: 'Duas Linhas' }, value: 'two-columns' },
                  ],
                  required: true,
                  defaultValue: 'single-column',
                  admin: {
                    description: 'Select the structure for the dropdown menu',
                  },
                },
                {
                  name: 'links',
                  label: { en: 'Dropdown Navigation Links', pt: 'Links de Navegação do Menu Suspenso' },
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
    afterChange: [revalidateHeader],
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
