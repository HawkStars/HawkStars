import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const GrowthVisionBlock: Block = {
  slug: 'growthVisionBlock',
  interfaceName: 'GrowthVisionBlock',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Uma visão em crescimento',
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
          'Subtitle displayed below the title (e.g., "(Curto, Médio e Longo Prazo)")',
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
      name: 'phases',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 5,
      labels: {
        singular: 'Phase',
        plural: 'Phases',
      },
      fields: [
        PayloadImageField({
          label: 'Phase Icon Image',
          name: 'icon',
          required: true,
          description: 'Illustration or icon representing this growth phase',
        }),
        {
          name: 'phaseName',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Phase name (e.g., "Curto prazo (até 2026)")',
          },
        },
        {
          name: 'items',
          type: 'array',
          required: true,
          minRows: 1,
          labels: {
            singular: 'Item',
            plural: 'Items',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'Goal or milestone description',
              },
            },
          ],
          admin: {
            description: 'List of goals/milestones for this phase',
          },
        },
      ],
      admin: {
        description: 'Growth phases with their respective goals',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Growth Vision Blocks',
    singular: 'Growth Vision Block',
  },
};
