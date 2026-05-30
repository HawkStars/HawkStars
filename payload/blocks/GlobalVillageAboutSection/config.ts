import type { Block } from 'payload';

import { PayloadImageField } from '@/payload/fields/ImageType';
import { link } from '@/payload/fields/link';
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical';
import SectionID from '@/payload/fields/SectionID';

export const GlobalVillageAboutSectionBlock: Block = {
  slug: 'globalVillageAboutSection',
  interfaceName: 'GlobalVillageAboutSectionBlock',
  labels: {
    singular: { en: 'Global Village About Section', pt: 'Secção Sobre a Aldeia Global' },
    plural: { en: 'Global Village About Sections', pt: 'Secções Sobre a Aldeia Global' },
  },
  admin: {
    group: 'Global Village',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: { en: 'Heading', pt: 'Título' },
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Description', pt: 'Descrição' },
      required: false,
      localized: true,
    },
    {
      name: 'sections',
      type: 'array',
      interfaceName: 'GlobalVillageAboutSectionItem',
      label: { en: 'Sections', pt: 'Secções' },
      minRows: 1,
      admin: {
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      labels: {
        singular: { en: 'Section', pt: 'Secção' },
        plural: { en: 'Sections', pt: 'Secções' },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: { en: 'Section Title', pt: 'Título da Secção' },
          localized: true,
        },
        {
          name: 'content',
          type: 'richText',
          label: { en: 'Content', pt: 'Conteúdo' },
          localized: true,
          required: true,
          editor: lexicalEditor({
            features: () => [
              HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
              UnorderedListFeature(),
            ],
          }),
        },
        PayloadImageField({ label: 'Section Image', name: 'sectionImage' }),
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: { en: 'Call to Action', pt: 'Chamada para Ação' },
      admin: {
        hideGutter: true,
      },
      fields: [
        {
          name: 'enable',
          type: 'checkbox',
          label: { en: 'Enable CTA', pt: 'Ativar CTA' },
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
