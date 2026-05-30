import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import { link } from '@/payload/fields/link';
import { Block } from 'payload';

export const BentoGridBlock: Block = {
  slug: 'bentoGrid',
  labels: {
    singular: { en: 'Bento Grid', pt: 'Bento Grid' },
    plural: { en: 'Bento Grids', pt: 'Bento Grids' },
  },
  interfaceName: 'BentoGridBlock',
  admin: {
    group: 'Layout',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: { en: 'Section Title', pt: 'Título da Secção' },
      localized: true,
      admin: {
        description: 'Optional title displayed above the grid',
      },
    },
    {
      name: 'sectionDescription',
      type: 'textarea',
      label: { en: 'Section Description', pt: 'Descrição da Secção' },
      localized: true,
      admin: {
        description: 'Optional description displayed below the section title',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: { en: 'Grid Items', pt: 'Itens da Grelha' },
      required: true,
      minRows: 1,
      interfaceName: 'BentoGridItem',
      admin: {
        description: 'Add items to the Bento Grid',
        components: {
          RowLabel: '@/payload/blocks/BentoGridBlock/admin/RowLabel',
        },
      },
      fields: [
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
        PayloadImageField({
          label: 'Background Image',
          name: 'backgroundImage',
          required: false,
        }),
        {
          name: 'overlayOpacity',
          type: 'select',
          label: { en: 'Overlay Opacity', pt: 'Opacidade da Sobreposição' },
          defaultValue: '50',
          admin: {
            description: 'Darkness of the overlay on the background image',
          },
          options: [
            { label: { en: 'None', pt: 'Nenhuma' }, value: '0' },
            { label: { en: 'Light (25%)', pt: 'Claro (25%)' }, value: '25' },
            { label: { en: 'Medium (50%)', pt: 'Médio (50%)' }, value: '50' },
            { label: { en: 'Dark (75%)', pt: 'Escuro (75%)' }, value: '75' },
            { label: { en: 'Very Dark (90%)', pt: 'Muito Escuro (90%)' }, value: '90' },
          ],
        },
        link({ localizedLabel: true, labelInformation: 'Call to Action Link' }),
        {
          name: 'column_size',
          type: 'select',
          label: { en: 'Column Size', pt: 'Tamanho da Coluna' },
          required: true,
          admin: {
            description: 'Select the width of the item based on grid columns (1 to 6)',
          },
          options: [
            { label: { en: '1 Column', pt: '1 Coluna' }, value: '1' },
            { label: { en: '2 Columns', pt: '2 Colunas' }, value: '2' },
            { label: { en: '3 Columns', pt: '3 Colunas' }, value: '3' },
            { label: { en: '4 Columns', pt: '4 Colunas' }, value: '4' },
            { label: { en: '5 Columns', pt: '5 Colunas' }, value: '5' },
            { label: { en: '6 Columns', pt: '6 Colunas' }, value: '6' },
          ],
          defaultValue: '2',
        },
        {
          name: 'row_size',
          type: 'select',
          label: { en: 'Row Size', pt: 'Tamanho da Linha' },
          required: true,
          admin: {
            description: 'Select the height of the item based on grid rows (1 to 6)',
          },
          options: [
            { label: { en: '1 Row', pt: '1 Linha' }, value: '1' },
            { label: { en: '2 Rows', pt: '2 Linhas' }, value: '2' },
            { label: { en: '3 Rows', pt: '3 Linhas' }, value: '3' },
            { label: { en: '4 Rows', pt: '4 Linhas' }, value: '4' },
            { label: { en: '5 Rows', pt: '5 Linhas' }, value: '5' },
            { label: { en: '6 Rows', pt: '6 Linhas' }, value: '6' },
          ],
          defaultValue: '1',
        },
        {
          name: 'contentPosition',
          type: 'select',
          label: { en: 'Content Position', pt: 'Posição do Conteúdo' },
          defaultValue: 'bottom-left',
          options: [
            { label: { en: 'Top Left', pt: 'Canto Superior Esquerdo' }, value: 'top-left' },
            { label: { en: 'Top Center', pt: 'Topo Centro' }, value: 'top-center' },
            { label: { en: 'Top Right', pt: 'Canto Superior Direito' }, value: 'top-right' },
            { label: { en: 'Center Left', pt: 'Centro Esquerdo' }, value: 'center-left' },
            { label: { en: 'Center', pt: 'Centro' }, value: 'center' },
            { label: { en: 'Center Right', pt: 'Centro Direito' }, value: 'center-right' },
            { label: { en: 'Bottom Left', pt: 'Canto Inferior Esquerdo' }, value: 'bottom-left' },
            { label: { en: 'Bottom Center', pt: 'Fundo Centro' }, value: 'bottom-center' },
            { label: { en: 'Bottom Right', pt: 'Canto Inferior Direito' }, value: 'bottom-right' },
          ],
        },
      ],
    },
    {
      name: 'rowGap',
      type: 'number',
      label: { en: 'Row Gap (px)', pt: 'Espaçamento entre Linhas (px)' },
      required: false,
      defaultValue: 24,
    },
    {
      name: 'columnGap',
      type: 'number',
      label: { en: 'Column Gap (px)', pt: 'Espaçamento entre Colunas (px)' },
      required: false,
      defaultValue: 16,
    },
    {
      name: 'numberColumns',
      type: 'select',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' },
        { label: '9', value: '9' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' },
      ],
      required: true,
      label: { en: 'Number of Columns', pt: 'Número de Colunas' },
      admin: {
        description: 'Number of columns in the grid. Dividing the screen width in x columns.',
      },
      defaultValue: '6',
    },
    {
      name: 'minRowHeight',
      type: 'number',
      label: { en: 'Minimum Row Height (px)', pt: 'Altura Mínima da Linha (px)' },
      defaultValue: 200,
      admin: {
        description: 'Minimum height for each grid row',
      },
    },
    SectionID,
  ],
};

export default BentoGridBlock;
