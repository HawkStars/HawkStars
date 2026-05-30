import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

export const DataGridBlock: Block = {
  slug: 'dataGridBlock',
  labels: {
    singular: { en: 'Data Grid Block', pt: 'Bloco de Grelha de Dados' },
    plural: { en: 'Data Grid Blocks', pt: 'Blocos de Grelha de Dados' },
  },
  interfaceName: 'DataGridBlock',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Título' },
      required: true,
      localized: true,
      admin: {
        description: 'Title displayed above the grid',
      },
    },
    {
      name: 'columnOneHeader',
      type: 'text',
      label: { en: 'Column 1 Header', pt: 'Cabeçalho da Coluna 1' },
      required: true,
      localized: true,
      defaultValue: 'Area',
      admin: {
        description: 'Header for the first column',
      },
    },
    {
      name: 'columnTwoHeader',
      type: 'text',
      label: { en: 'Column 2 Header', pt: 'Cabeçalho da Coluna 2' },
      required: true,
      localized: true,
      defaultValue: 'Meta',
      admin: {
        description: 'Header for the second column',
      },
    },
    {
      name: 'rows',
      type: 'array',
      label: { en: 'Rows', pt: 'Linhas' },
      interfaceName: 'DataGridBlockRow',
      required: true,
      minRows: 1,
      admin: {
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      labels: {
        singular: { en: 'Row', pt: 'Linha' },
        plural: { en: 'Rows', pt: 'Linhas' },
      },
      fields: [
        {
          name: 'columnOne',
          type: 'text',
          label: { en: 'Column 1', pt: 'Coluna 1' },
          required: true,
          localized: true,
          admin: {
            description: 'Value for the first column',
          },
        },
        {
          name: 'columnTwo',
          type: 'text',
          label: { en: 'Column 2', pt: 'Coluna 2' },
          required: true,
          localized: true,
          admin: {
            description: 'Value for the second column',
          },
        },
      ],
    },
    SectionID,
  ],
};
