import SectionID from '@/payload/fields/SectionID';
import PayloadLucideIcon from '@/payload/fields/ImageIcon/payload-lucide-icon';
import type { Block } from 'payload';

/**
 * A titled grid of icon cards — for an organisation's values, pillars, principles
 * or any short "name + one paragraph" list that reads better as cards than as a
 * plain list.
 */
export const ValuesGridBlock: Block = {
  slug: 'valuesGrid',
  interfaceName: 'ValuesGridBlock',
  labels: {
    singular: { en: 'Values Grid', pt: 'Grelha de Valores' },
    plural: { en: 'Values Grids', pt: 'Grelhas de Valores' },
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: { en: 'Eyebrow', pt: 'Sobretítulo' },
      localized: true,
      admin: {
        description: {
          en: 'Small uppercase label above the title (optional)',
          pt: 'Pequeno rótulo em maiúsculas acima do título (opcional)',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Título' },
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          label: { en: 'Columns', pt: 'Colunas' },
          required: true,
          defaultValue: '3',
          options: [
            { label: { en: '2 Columns', pt: '2 Colunas' }, value: '2' },
            { label: { en: '3 Columns', pt: '3 Colunas' }, value: '3' },
            { label: { en: '4 Columns', pt: '4 Colunas' }, value: '4' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'background',
          type: 'select',
          label: { en: 'Background', pt: 'Fundo' },
          required: true,
          defaultValue: 'white',
          options: [
            { label: { en: 'White', pt: 'Branco' }, value: 'white' },
            { label: { en: 'Beige', pt: 'Bege' }, value: 'bege' },
            { label: { en: 'Green', pt: 'Verde' }, value: 'green' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'numbered',
          type: 'checkbox',
          label: { en: 'Show numbers (01, 02…)', pt: 'Mostrar números (01, 02…)' },
          defaultValue: false,
          admin: {
            width: '33%',
            style: { alignSelf: 'center' },
            description: {
              en: 'Used on cards without an icon',
              pt: 'Usado nos cartões sem ícone',
            },
          },
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      interfaceName: 'ValuesGridItem',
      label: { en: 'Cards', pt: 'Cartões' },
      required: true,
      minRows: 1,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [
        PayloadLucideIcon(),
        {
          name: 'title',
          type: 'text',
          label: { en: 'Title', pt: 'Título' },
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: { en: 'Description', pt: 'Descrição' },
          localized: true,
        },
      ],
    },
    SectionID,
  ],
};
