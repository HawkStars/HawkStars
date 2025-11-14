import type { Block } from 'payload';

export const ImpactBlock: Block = {
  slug: 'impactBlock',
  interfaceName: 'ImpactBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Main title for the impact section',
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
      name: 'metrics',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
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
          name: 'value',
          type: 'number',
          required: true,
          admin: {
            description: 'The numerical value',
          },
        },
        {
          name: 'suffix',
          type: 'text',
          admin: {
            description: 'Optional suffix (e.g., "+", "%", "€", "people")',
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
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name (e.g., "Users", "Heart", "Target")',
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
              label: 'Gray',
              value: 'gray',
            },
          ],
          defaultValue: 'blue',
        },
        {
          name: 'animateOnScroll',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Animate the number when it comes into view',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        {
          label: 'Grid (2 columns)',
          value: 'grid-2',
        },
        {
          label: 'Grid (3 columns)',
          value: 'grid-3',
        },
        {
          label: 'Grid (4 columns)',
          value: 'grid-4',
        },
        {
          label: 'Row (horizontal)',
          value: 'row',
        },
      ],
      defaultValue: 'grid-3',
      admin: {
        description: 'How to display the metrics',
      },
    },
    {
      name: 'background',
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
      admin: {
        description: 'Background style for the impact section',
      },
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
    plural: 'Impact Blocks',
    singular: 'Impact Block',
  },
};
