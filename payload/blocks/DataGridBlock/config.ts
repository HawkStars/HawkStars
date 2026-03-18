import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

export const DataGridBlock: Block = {
  slug: 'dataGridBlock',
  labels: {
    singular: 'Data Grid Block',
    plural: 'Data Grid Blocks',
  },
  interfaceName: 'DataGridBlock',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Title displayed above the grid',
      },
    },
    {
      name: 'columnOneHeader',
      type: 'text',
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
      required: true,
      minRows: 1,
      labels: {
        singular: 'Row',
        plural: 'Rows',
      },
      fields: [
        {
          name: 'columnOne',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Value for the first column',
          },
        },
        {
          name: 'columnTwo',
          type: 'text',
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
