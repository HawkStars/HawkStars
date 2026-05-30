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
      label: { en: 'Title', pt: 'Título' },
      admin: {
        description: 'Main heading for the section',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      admin: {
        description:
          'Subtitle displayed below the title (e.g., "A região da Beira Interior enfrenta hoje:")',
      },
    },
    {
      name: 'badge',
      type: 'text',
      localized: true,
      label: { en: 'Badge', pt: 'Distintivo' },
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
      label: { en: 'Background', pt: 'Fundo' },
      options: [
        { label: { en: 'White', pt: 'Branco' }, value: 'white' },
        { label: { en: 'Beige', pt: 'Bege' }, value: 'bege' },
        { label: { en: 'Green', pt: 'Verde' }, value: 'green' },
      ],
      admin: {
        description: 'Background color for the section',
      },
    },
    {
      name: 'challenges',
      type: 'array',
      interfaceName: 'WhyHereWhyNowChallenge',
      required: true,
      minRows: 1,
      maxRows: 6,
      label: { en: 'Challenges', pt: 'Desafios' },
      labels: {
        singular: { en: 'Challenge', pt: 'Desafio' },
        plural: { en: 'Challenges', pt: 'Desafios' },
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
          label: { en: 'Label', pt: 'Rótulo' },
          admin: {
            description:
              'Description text below the icon (e.g., "Inversão da pirâmide demográfica")',
          },
        },
      ],
      admin: {
        description: 'List of regional challenges/statistics to display (max 6)',
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Why Here Why Now Blocks', pt: 'Blocos Porque Aqui Porque Agora' },
    singular: { en: 'Why Here Why Now Block', pt: 'Bloco Porque Aqui Porque Agora' },
  },
};
