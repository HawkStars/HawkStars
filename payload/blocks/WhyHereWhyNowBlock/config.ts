import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const WhyHereWhyNowBlock: Block = {
  slug: 'whyHereWhyNowBlock',
  interfaceName: 'WhyHereWhyNowBlock',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Porque aqui? Porque agora?',
      admin: {
        description: 'Main heading for the section',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Subtitle displayed below the title (e.g., "A região da Beira Interior enfrenta hoje:")',
      },
    },
    {
      name: 'badge',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Optional badge/tag text displayed in the top-right corner (e.g., "Think Global, Act Local")',
      },
    },
    {
      name: 'background',
      type: 'select',
      required: true,
      defaultValue: 'bege',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Bege', value: 'bege' },
        { label: 'Green', value: 'green' },
      ],
      admin: {
        description: 'Background color for the section',
      },
    },
    {
      name: 'challenges',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      labels: {
        singular: 'Challenge',
        plural: 'Challenges',
      },
      fields: [
        PayloadImageField({
          label: 'Icon Image',
          name: 'icon',
          required: false,
          description: 'Illustration or icon representing this challenge',
        }),
        {
          name: 'label',
          type: 'textarea',
          required: true,
          localized: true,
          admin: {
            description:
              'Description text below the icon (e.g., "Inversão da pirâmide demográfica")',
          },
        },
      ],
      admin: {
        description: 'List of regional challenges/statistics to display (max 6)',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Why Here Why Now Blocks',
    singular: 'Why Here Why Now Block',
  },
};
