import { linkGroup } from '@/payload/fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const DonationProgressBlock: Block = {
  slug: 'donationProgress',
  interfaceName: 'DonationProgressBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Campaign title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Brief description of the campaign',
      },
    },
    {
      name: 'goalAmount',
      type: 'number',
      required: true,
      admin: {
        description: 'Fundraising goal amount',
      },
    },
    {
      name: 'currentAmount',
      type: 'number',
      required: true,
      admin: {
        description: 'Current amount raised',
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
      name: 'donorCount',
      type: 'number',
      admin: {
        description: 'Number of donors (optional)',
      },
    },
    linkGroup({ overrides: { maxRows: 2 } }),
    {
      name: 'showPercentage',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display percentage progress',
      },
    },
    {
      name: 'animateProgress',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Animate progress bar on scroll',
      },
    },
    {
      name: 'theme',
      type: 'select',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Gradient', value: 'gradient' },
      ],
      defaultValue: 'light',
      admin: {
        description: 'Visual theme for the block',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Donation Progress Blocks',
    singular: 'Donation Progress Block',
  },
};
