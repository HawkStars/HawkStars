import type { Block } from 'payload';

export const ColumnBased: Block = {
  slug: 'columnBased',
  interfaceName: 'ColumnBasedBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      required: true,
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name (e.g., "User", "Mail", "Calendar")',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'list',
          type: 'array',
          fields: [
            {
              name: 'item',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Column Based Blocks',
    singular: 'Column Based Block',
  },
};
