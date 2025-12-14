import type { Block } from 'payload';

export const SocialProofBlock: Block = {
  slug: 'socialProof',
  interfaceName: 'SocialProofBlock',
  fields: [
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
          admin: {
            description: 'Number or stat (e.g., "500+", "95%")',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
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
  ],
  labels: {
    plural: 'Social Proof Blocks',
    singular: 'Social Proof Block',
  },
};
