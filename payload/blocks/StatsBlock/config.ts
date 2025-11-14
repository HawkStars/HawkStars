import type { Block } from 'payload';

export const StatsBlock: Block = {
  slug: 'statsBlock',
  interfaceName: 'StatsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional title for the statistics section',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional subtitle or description',
      },
    },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
          admin: {
            description: 'The numerical value',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Description of what this number represents',
          },
        },
        {
          name: 'prefix',
          type: 'text',
          admin: {
            description: 'Optional prefix (e.g., "€", "$", ">")',
          },
        },
        {
          name: 'suffix',
          type: 'text',
          admin: {
            description: 'Optional suffix (e.g., "+", "%", "€", "people", "countries")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Optional additional description or context',
          },
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name (e.g., "Users", "Heart", "Target", "TrendingUp")',
          },
        },
        {
          name: 'color',
          type: 'select',
          options: [
            {
              label: 'Blue',
              value: 'blue',
            },
            {
              label: 'Green',
              value: 'green',
            },
            {
              label: 'Red',
              value: 'red',
            },
            {
              label: 'Yellow',
              value: 'yellow',
            },
            {
              label: 'Purple',
              value: 'purple',
            },
            {
              label: 'Orange',
              value: 'orange',
            },
            {
              label: 'Gray',
              value: 'gray',
            },
          ],
          defaultValue: 'blue',
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as highlighted/featured statistic',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        {
          label: '2 Columns',
          value: 'cols-2',
        },
        {
          label: '3 Columns',
          value: 'cols-3',
        },
        {
          label: '4 Columns',
          value: 'cols-4',
        },
        {
          label: 'Single Row',
          value: 'row',
        },
      ],
      defaultValue: 'cols-3',
      admin: {
        description: 'How to display the statistics',
      },
    },
    {
      name: 'style',
      type: 'select',
      options: [
        {
          label: 'Cards',
          value: 'cards',
        },
        {
          label: 'Minimal',
          value: 'minimal',
        },
        {
          label: 'Bordered',
          value: 'bordered',
        },
        {
          label: 'Background Circles',
          value: 'circles',
        },
      ],
      defaultValue: 'cards',
      admin: {
        description: 'Visual style of the statistics',
      },
    },
    {
      name: 'animateNumbers',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Animate numbers when they come into view',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      options: [
        {
          label: 'None (transparent)',
          value: 'none',
        },
        {
          label: 'Light Gray',
          value: 'light-gray',
        },
        {
          label: 'Dark',
          value: 'dark',
        },
        {
          label: 'Gradient',
          value: 'gradient',
        },
      ],
      defaultValue: 'none',
    },
    {
      name: 'textAlign',
      type: 'select',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      defaultValue: 'center',
    },
  ],
  labels: {
    plural: 'Stats Blocks',
    singular: 'Stats Block',
  },
};
