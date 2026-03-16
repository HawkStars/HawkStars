import { PayloadImageField } from '@/payload/fields/ImageType';
import { linkGroup } from '@/payload/fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const HeroImpactStats: Block = {
  slug: 'heroImpactStats',
  interfaceName: 'HeroImpactStatsBlock',
  admin: {
    group: 'Hero',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      localized: true,
      admin: {
        description: 'Small badge text (e.g., "OUR IMPACT")',
      },
    },
    {
      name: 'title',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Main heading text',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Description or mission statement',
      },
    },
    PayloadImageField({
      name: 'heroImage',
      label: 'Hero Image',
      required: false,
      description: 'Hero image displayed alongside content',
    }),
    {
      name: 'stats',
      type: 'array',
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Statistic number (e.g., "500+", "10K")',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Statistic label (e.g., "Lives Changed", "Volunteers")',
          },
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Heart', value: 'heart' },
            { label: 'Users', value: 'users' },
            { label: 'Globe', value: 'globe' },
            { label: 'Target', value: 'target' },
            { label: 'TrendingUp', value: 'trendingUp' },
            { label: 'Award', value: 'award' },
          ],
          admin: {
            description: 'Icon for this statistic',
          },
        },
      ],
      minRows: 2,
      maxRows: 4,
      admin: {
        description: 'Impact statistics (2-4 stats)',
      },
    },
    linkGroup({ overrides: { maxRows: 2 } }),
    SectionID,
  ],
  labels: {
    plural: 'Hero Impact Stats Sections',
    singular: 'Hero Impact Stats Section',
  },
};
