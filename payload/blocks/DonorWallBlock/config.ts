import type { Block } from 'payload';

export const DonorWallBlock: Block = {
  slug: 'donorWall',
  interfaceName: 'DonorWallBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Our Amazing Donors',
      admin: {
        description: 'Section title',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      admin: {
        description: 'Optional subtitle or thank you message',
      },
    },
    {
      name: 'donors',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Donor name or organization',
          },
        },
        {
          name: 'amount',
          type: 'number',
          admin: {
            description: 'Donation amount (optional)',
          },
        },
        {
          name: 'currency',
          type: 'text',
          defaultValue: '€',
        },
        {
          name: 'level',
          type: 'select',
          options: [
            { label: 'Platinum', value: 'platinum' },
            { label: 'Gold', value: 'gold' },
            { label: 'Silver', value: 'silver' },
            { label: 'Bronze', value: 'bronze' },
            { label: 'Supporter', value: 'supporter' },
          ],
          admin: {
            description: 'Donor tier/level',
          },
        },
        {
          name: 'message',
          type: 'textarea',
          admin: {
            description: 'Optional message or quote from donor',
          },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Organization logo (optional)',
          },
        },
      ],
      admin: {
        description: 'List of donors to display',
      },
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Wall (Names)', value: 'wall' },
        { label: 'Cards', value: 'cards' },
      ],
      defaultValue: 'grid',
      admin: {
        description: 'Display layout style',
      },
    },
    {
      name: 'showAmounts',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Display donation amounts',
      },
    },
    {
      name: 'sortBy',
      type: 'select',
      options: [
        { label: 'Amount (High to Low)', value: 'amount-desc' },
        { label: 'Level (Platinum first)', value: 'level' },
        { label: 'Name (A-Z)', value: 'name' },
        { label: 'Manual Order', value: 'manual' },
      ],
      defaultValue: 'level',
      admin: {
        description: 'How to sort donor display',
      },
    },
  ],
  labels: {
    plural: 'Donor Walls',
    singular: 'Donor Wall',
  },
};
