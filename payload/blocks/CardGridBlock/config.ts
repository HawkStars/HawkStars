import type { Block } from 'payload';

export const CardGridBlock: Block = {
  slug: 'cardGridBlock',
  interfaceName: 'CardGridBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: false,
      admin: {
        description: 'Optional title for the feature section',
      },
    },
    {
      name: 'features',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          localized: false,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          localized: false,
        },
        {
          name: 'icon',
          type: 'text',
          required: true,
          admin: {
            description:
              'Lucide icon name (e.g., "GitPullRequest", "SquareKanban", "RadioTower", "WandSparkles", "Layers", "BatteryCharging")',
          },
        },
      ],
    },
    {
      name: 'buttonText',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional button text (button hidden if empty)',
      },
    },
    {
      name: 'buttonUrl',
      type: 'text',
      admin: {
        description: 'Optional button URL (button hidden if empty)',
      },
    },
  ],
  labels: {
    plural: 'Card Grid Blocks',
    singular: 'Card Grid Block',
  },
};
