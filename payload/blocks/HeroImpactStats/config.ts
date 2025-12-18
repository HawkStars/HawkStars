import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const HeroImpactStats: Block = {
  slug: 'heroImpactStats',
  interfaceName: 'HeroImpactStatsBlock',
  fields: [
    {
      name: 'badge',
      type: 'text',
      admin: {
        description: 'Small badge text (e.g., "OUR IMPACT")',
      },
    },
    {
      name: 'title',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Main heading text',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description or mission statement',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero image displayed alongside content',
      },
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          admin: {
            description: 'Statistic number (e.g., "500+", "10K")',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
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
    {
      name: 'ctaText',
      type: 'text',
      admin: {
        description: 'Call-to-action button text',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      admin: {
        description: 'URL for the CTA button',
      },
    },
    {
      name: 'secondaryCtaText',
      type: 'text',
      admin: {
        description: 'Secondary CTA button text',
      },
    },
    {
      name: 'secondaryCtaLink',
      type: 'text',
      admin: {
        description: 'URL for the secondary CTA button',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Hero Impact Stats Sections',
    singular: 'Hero Impact Stats Section',
  },
};
