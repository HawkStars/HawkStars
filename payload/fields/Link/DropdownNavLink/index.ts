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
      label: { en: 'Featured Link', pt: 'Link em Destaque' },
      required: false,
      admin: {
        description: {
          en: 'Mark this link as featured to highlight it in the dropdown menu.',
          pt: 'Marque este link como destaque para o realçar no menu suspenso.',
        },
      },
    },
    {
      name: 'visible',
      type: 'checkbox',
      label: { en: 'Visible On the Header', pt: 'Visível no Cabeçalho' },
      required: false,
      defaultValue: true,
      admin: {
        description: {
          en: 'Uncheck this to hide the link from the header dropdown menu.',
          pt: 'Desmarque para ocultar o link do menu suspenso do cabeçalho.',
        },
      },
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: { en: 'Image Position', pt: 'Posição da Imagem' },
      options: [
        { label: { en: 'Top', pt: 'Topo' }, value: 'top' },
        { label: { en: 'Center', pt: 'Centro' }, value: 'center' },
        { label: { en: 'Bottom', pt: 'Fundo' }, value: 'bottom' },
      ],
      required: false,
    },
    {
      name: 'description',
      label: { en: 'Description', pt: 'Descrição' },
      type: 'text',
      localized: true,
    },
    link({ localizedLabel: true }),
    PayloadIconOrImage(),
  ],
};
