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
        description: { en: 'Title displayed above the grid', pt: 'Título exibido acima da grelha' },
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
        description: { en: 'Header for the first column', pt: 'Cabeçalho da primeira coluna' },
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
        description: { en: 'Header for the second column', pt: 'Cabeçalho da segunda coluna' },
      },
    },
    {
      name: 'columnThreeHeader',
      type: 'text',
      label: { en: 'Column 3 Header (optional)', pt: 'Cabeçalho da Coluna 3 (opcional)' },
      required: false,
      localized: true,
      admin: {
        description: {
          en: 'Optional header for a third column. Leave empty to render a 2-column grid.',
          pt: 'Cabeçalho opcional para uma terceira coluna. Deixe vazio para uma grelha de 2 colunas.',
        },
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
            description: { en: 'Value for the first column', pt: 'Valor da primeira coluna' },
          },
        },
        {
          name: 'columnTwo',
          type: 'text',
          label: { en: 'Column 2', pt: 'Coluna 2' },
          required: true,
          localized: true,
          admin: {
            description: { en: 'Value for the second column', pt: 'Valor da segunda coluna' },
          },
        },
        {
          name: 'columnThree',
          type: 'text',
          label: { en: 'Column 3 (optional)', pt: 'Coluna 3 (opcional)' },
          required: false,
          localized: true,
          admin: {
            description: {
              en: 'Optional value for the third column',
              pt: 'Valor opcional para a terceira coluna',
            },
          },
        },
      ],
    },
    SectionID,
  ],
};
