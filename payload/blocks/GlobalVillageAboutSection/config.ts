import type { Block } from 'payload';

import { PayloadImageField } from '@/payload/fields/ImageType';
import { link } from '@/payload/fields/link';
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import SectionID from '@/payload/fields/SectionID';

export const GlobalVillageAboutSectionBlock: Block = {
  slug: 'globalVillageAboutSection',
  interfaceName: 'GlobalVillageAboutSectionBlock',
  labels: {
    singular: 'Global Village About Section',
    plural: 'Global Village About Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: false,
      localized: true,
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Sections',
      minRows: 1,
      labels: {
        singular: 'Section',
        plural: 'Sections',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          localized: true,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Content',
          localized: true,
          required: true,
          editor: lexicalEditor({
            features: () => [
              HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
        PayloadImageField({ label: 'Section Image' }),
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      admin: {
        hideGutter: true,
      },
      fields: [
        {
          name: 'enable',
          type: 'checkbox',
          label: 'Enable CTA',
          defaultValue: false,
        },
        link({
          localizedLabel: true,
          condition: (_, siblingData) => siblingData?.enable === true,
        }),
      ],
    },
    SectionID,
  ],
};
