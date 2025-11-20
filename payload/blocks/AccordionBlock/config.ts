import type { Block } from 'payload';

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';

export const AccordionBlock: Block = {
  slug: 'accordionBlock',
  interfaceName: 'AccordionBlock',
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: false,
        },
        {
          name: 'content',
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
          required: true,
          localized: false,
        },
        {
          name: 'defaultOpen',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether this accordion item should be open by default',
          },
        },
      ],
    },
    {
      name: 'allowMultipleOpen',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Allow multiple accordion items to be open at the same time',
      },
    },
    {
      name: 'style',
      type: 'select',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Bordered',
          value: 'bordered',
        },
        {
          label: 'Card Style',
          value: 'card',
        },
      ],
      defaultValue: 'default',
      admin: {
        description: 'Visual style of the accordion',
      },
    },
  ],
  labels: {
    plural: 'Accordion Blocks',
    singular: 'Accordion Block',
  },
};
