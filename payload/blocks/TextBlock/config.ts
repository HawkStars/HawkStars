import type { Block } from 'payload';

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';

export const TextBlock: Block = {
  slug: 'textBlock',
  interfaceName: 'TextBlock',
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
      required: true,
      localized: false,
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
        {
          label: 'Justify',
          value: 'justify',
        },
      ],
      defaultValue: 'left',
      admin: {
        description: 'Text alignment for the content',
      },
    },
    {
      name: 'maxWidth',
      type: 'select',
      options: [
        {
          label: 'Full Width',
          value: 'full',
        },
        {
          label: 'Large (1200px)',
          value: 'large',
        },
        {
          label: 'Medium (800px)',
          value: 'medium',
        },
        {
          label: 'Small (600px)',
          value: 'small',
        },
      ],
      defaultValue: 'large',
      admin: {
        description: 'Maximum width constraint for the text content',
      },
    },
  ],
  labels: {
    plural: 'Text Blocks',
    singular: 'Text Block',
  },
};
