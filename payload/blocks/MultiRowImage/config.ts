import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

const MultiRowImage: Block = {
  slug: 'multiRowImage',
  admin: {
    group: 'Media',
  },

  labels: {
    singular: { en: 'Multi Row Image', pt: 'Imagem em Múltiplas Linhas' },
    plural: { en: 'Multi Row Images', pt: 'Imagens em Múltiplas Linhas' },
  },
  interfaceName: 'MultiRowImageBlock',
  fields: [
    {
      name: 'rows',
      type: 'array',
      interfaceName: 'MultiRowImageRow',
      label: { en: 'Image Rows', pt: 'Linhas de Imagem' },
      required: true,
      maxRows: 1,
      minRows: 1,
      admin: {
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'images',
          type: 'array',
          label: { en: 'Images', pt: 'Imagens' },
          required: true,
          minRows: 1,
          interfaceName: 'MultiRowImageContent',
          admin: {
            components: {
              RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
            },
          },
          fields: [
            PayloadImageField({ label: 'Image', name: 'image' }),
            {
              name: 'column_size',
              type: 'select',
              label: { en: 'Column Image Size', pt: 'Tamanho da Coluna da Imagem' },
              required: true,
              admin: {
                description:
                  'Select the size of the image based on the grid columns. 1 to 6 columns.',
              },
              options: [
                { label: { en: '1 Column', pt: '1 Coluna' }, value: '1' },
                { label: { en: '2 Columns', pt: '2 Colunas' }, value: '2' },
                { label: { en: '3 Columns', pt: '3 Colunas' }, value: '3' },
                { label: { en: '4 Columns', pt: '4 Colunas' }, value: '4' },
                { label: { en: '5 Columns', pt: '5 Colunas' }, value: '5' },
                { label: { en: '6 Columns', pt: '6 Colunas' }, value: '6' },
              ],
            },
            {
              name: 'row_size',
              type: 'select',
              required: true,
              label: { en: 'Row Image Size', pt: 'Tamanho da Linha da Imagem' },
              admin: {
                description: 'Select the size of the image based on the grid rows. 1 to 6 rows.',
              },
              options: [
                { label: { en: '1 Row', pt: '1 Linha' }, value: '1' },
                { label: { en: '2 Rows', pt: '2 Linhas' }, value: '2' },
                { label: { en: '3 Rows', pt: '3 Linhas' }, value: '3' },
                { label: { en: '4 Rows', pt: '4 Linhas' }, value: '4' },
                { label: { en: '5 Rows', pt: '5 Linhas' }, value: '5' },
                { label: { en: '6 Rows', pt: '6 Linhas' }, value: '6' },
              ],
            },
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
    SectionID,
  ],
};

export default MultiRowImage;
