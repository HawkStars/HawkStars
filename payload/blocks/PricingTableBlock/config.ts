import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const PricingTableBlock: Block = {
  slug: 'pricingTable',
  interfaceName: 'PricingTableBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Section title',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      admin: {
        description: 'Section subtitle or description',
      },
    },
    {
      name: 'tiers',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Tier name (e.g., "Bronze", "Silver", "Gold")',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: {
            description: 'Price amount',
          },
        },
        {
          name: 'currency',
          type: 'text',
          defaultValue: '€',
          admin: {
            description: 'Currency symbol',
          },
        },
        {
          name: 'period',
          type: 'text',
          defaultValue: '/month',
          admin: {
            description: 'Billing period (e.g., "/month", "/year", "one-time")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Brief description of this tier',
          },
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
          ],
          admin: {
            description: 'List of features included in this tier',
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'Choose Plan',
          admin: {
            description: 'CTA button text',
          },
        },
        {
          name: 'buttonLink',
          type: 'text',
          admin: {
            description: 'CTA button URL',
          },
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark this tier as featured/recommended',
          },
        },
        {
          name: 'badge',
          type: 'text',
          admin: {
            description: 'Optional badge text (e.g., "Most Popular", "Best Value")',
          },
        },
      ],
      admin: {
        description: 'Pricing tiers (up to 4)',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Pricing Tables',
    singular: 'Pricing Table',
  },
};
