import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const FeatureComparisonBlock: Block = {
  slug: 'featureComparison',
  interfaceName: 'FeatureComparisonBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'columns',
      type: 'array',
      minRows: 2,
      maxRows: 3,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
        {
          name: 'column1',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'column2',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'column3',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    SectionID,
  ],
  labels: {
    plural: 'Feature Comparisons',
    singular: 'Feature Comparison',
  },
};
