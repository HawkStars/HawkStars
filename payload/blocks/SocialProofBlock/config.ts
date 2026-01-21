import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const SocialProofBlock: Block = {
  slug: 'socialProof',
  interfaceName: 'SocialProofBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      localized: true,
      admin: {
        description: 'Main title for the social proof section. Optional.',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      required: false,
      admin: {
        description: 'Optional subtitle or description. Optional.x',
      },
    },
    {
      name: 'stats',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Number or stat (e.g., "500+", "95%")',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Gray', value: 'gray' },
        { label: 'Gradient', value: 'gradient' },
      ],
      defaultValue: 'white',
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
      admin: {
        description: 'Text alignment for the social proof section',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Social Proof Blocks',
    singular: 'Social Proof Block',
  },
};
