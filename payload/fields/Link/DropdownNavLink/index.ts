import { ArrayField } from 'payload';
import { link } from '../../link';
import { PayloadIconOrImage } from '../../ImageIcon';

export const dropdownNavLink: ArrayField = {
  name: 'dropdownNavLink',
  label: { en: 'Dropdown Navigation Links', pt: 'Links do Menu Suspenso' },
  labels: {
    singular: { en: 'Link', pt: 'Link' },
    plural: { en: 'Links', pt: 'Links' },
  },
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
        { label: { en: 'None', pt: 'Sem preferência' }, value: '' },
      ],
      defaultValue: '',
      required: false,
    },
    {
      name: 'description',
      label: { en: 'Description', pt: 'Descrição' },
      type: 'text',
      localized: true,
      admin: {
        description: {
          en: 'One short line shown under the link. Write it in the language selected at the top of the editor.',
          pt: 'Uma linha curta mostrada por baixo do link. Escreva-a na língua selecionada no topo do editor.',
        },
      },
    },
    link({ localizedLabel: true }),
    PayloadIconOrImage(),
  ],
};
