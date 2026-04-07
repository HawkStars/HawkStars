import type { Block } from 'payload';

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import SectionID from '@/payload/fields/SectionID';
import { PayloadImageField } from '@/payload/fields/ImageType';
import { SectionListBlock } from '../SectionListBlock/config';

export const ContentWithImage: Block = {
  slug: 'contentWithImage',
  interfaceName: 'ContentWithImageBlock',
  admin: {
    group: 'Content',
  },
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
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          BlocksFeature({
            blocks: [SectionListBlock],
            inlineBlocks: [],
          }),
        ],
      }),
      required: true,
    },
    PayloadImageField({ name: 'image', label: 'Image', required: true }),
    {
      name: 'imagePosition',
      type: 'select',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      defaultValue: 'right',
      admin: {
        description: 'Position of the image relative to the content',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Content with Image Blocks',
    singular: 'Content with Image Block',
  },
};
