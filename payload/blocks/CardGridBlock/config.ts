import type { Block } from 'payload';

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';

import { linkGroup } from '../../fields/linkGroup';

export const CardGridBlock: Block = {
  slug: 'cardGridBlock',
  interfaceName: 'CardGridBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional title for the card grid section',
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
      name: 'cards',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3', 'h4', 'h5', 'h6'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ];
            },
          }),
          localized: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Card image (optional)',
          },
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description:
              'Lucide icon name (e.g., "User", "Heart", "Star") - used if no image provided',
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
          admin: {
            description: 'Color theme for the card',
          },
        },
        linkGroup({
          overrides: {
            maxRows: 1,
          },
        }),
      ],
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        {
          label: '1 Column',
          value: 'cols-1',
        },
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
      ],
      defaultValue: 'cols-3',
      admin: {
        description: 'Number of columns in the grid',
      },
    },
    {
      name: 'cardStyle',
      type: 'select',
      options: [
        {
          label: 'Standard Card',
          value: 'standard',
        },
        {
          label: 'Hover Effect',
          value: 'hover',
        },
        {
          label: 'Minimal',
          value: 'minimal',
        },
        {
          label: 'Bordered',
          value: 'bordered',
        },
      ],
      defaultValue: 'standard',
      admin: {
        description: 'Visual style of the cards',
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
    plural: 'Card Grid Blocks',
    singular: 'Card Grid Block',
  },
};
