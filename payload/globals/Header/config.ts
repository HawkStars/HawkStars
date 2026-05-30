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
    description: {
      en: 'Configure the header navigation columns. If a column has more than one link it will show a dropdown menu.',
      pt: 'Configure as colunas de navegação do cabeçalho. Se uma coluna tiver mais do que um link, mostrará um menu suspenso.',
    },
  },
  fields: [
    {
      required: true,
      name: 'columns',
      label: { en: 'Header Navigation Columns', pt: 'Colunas de Navegação do Cabeçalho' },
      interfaceName: 'HeaderNavigationColumns',
      admin: {
        description: {
          en: 'Configure the navigation columns for the header. topbar menus',
          pt: 'Configure as colunas de navegação do cabeçalho. Menus da barra superior.',
        },
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
            description: {
              en: 'Enable this option if you want the links to be displayed in multiple columns in the dropdown menu.',
              pt: 'Ative esta opção se quiser que os links sejam exibidos em múltiplas colunas no menu suspenso.',
            },
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
            description: {
              en: 'Content for the dropdown menu when multiple links are present',
              pt: 'Conteúdo do menu suspenso quando existem múltiplos links',
            },
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
              admin: {
                description: {
                  en: 'Title for the dropdown menu',
                  pt: 'Título do menu suspenso',
                },
              },
            },
            {
              name: 'key',
              label: { en: 'Key', pt: 'Chave' },
              admin: {
                description: {
                  en: 'Unique key for the navigation group to be used on the dropdown menu',
                  pt: 'Chave única para o grupo de navegação usado no menu suspenso',
                },
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
                    description: {
                      en: 'Select the structure for the dropdown menu',
                      pt: 'Selecione a estrutura do menu suspenso',
                    },
                  },
                },
                {
                  name: 'links',
                  label: {
                    en: 'Dropdown Navigation Links',
                    pt: 'Links de Navegação do Menu Suspenso',
                  },
                  type: 'group',
                  fields: [dropdownNavLink],
                  required: true,
                  admin: {
                    description: {
                      en: 'Dropdown Navigation Links for this entry',
                      pt: 'Links de navegação do menu suspenso para esta entrada',
                    },
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
