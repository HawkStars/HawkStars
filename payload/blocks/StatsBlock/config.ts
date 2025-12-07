import type { Block } from 'payload';

export const StatsBlock: Block = {
  slug: 'statsBlock',
  interfaceName: 'StatsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: false,
      admin: {
        description: 'Main heading (e.g., "We don\'t just talk we Deliver Results")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: false,
      admin: {
        description: 'Description text under the heading',
      },
    },
    {
      name: 'ctaButtonText',
      type: 'text',
      localized: false,
      admin: {
        description: 'CTA button text (e.g., "Get Started With Us")',
      },
    },
    {
      name: 'primaryStat',
      type: 'group',
      label: 'Primary Statistic (Large)',
      fields: [
        {
          name: 'monthlyValue',
          type: 'number',
          required: true,
          admin: {
            description: 'Monthly value for the main statistic',
          },
        },
        {
          name: 'yearlyValue',
          type: 'number',
          required: true,
          admin: {
            description: 'Yearly value for the main statistic',
          },
        },
        {
          name: 'prefix',
          type: 'text',
          admin: {
            description: 'Optional prefix (e.g., "$")',
          },
        },
        {
          name: 'suffix',
          type: 'text',
          admin: {
            description: 'Optional suffix (e.g., "M")',
          },
        },
      ],
    },
    {
      name: 'secondaryText',
      type: 'text',
      localized: false,
      admin: {
        description: 'Text below primary stat (e.g., "And its just in a year")',
      },
    },
    {
      name: 'toggleButtonText',
      type: 'text',
      localized: false,
      admin: {
        description: 'Toggle button text (e.g., "Show Monthly Stats")',
      },
    },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      required: true,
      label: 'Secondary Statistics',
      admin: {
        description: 'Add up to 4 secondary statistics displayed in a 2x2 grid',
      },
      fields: [
        {
          name: 'monthlyValue',
          type: 'number',
          required: true,
          admin: {
            description: 'Monthly value',
          },
        },
        {
          name: 'yearlyValue',
          type: 'number',
          required: true,
          admin: {
            description: 'Yearly value',
          },
        },
        {
          name: 'suffix',
          type: 'text',
          admin: {
            description: 'Suffix (e.g., "k+", "%", "M", "+")',
          },
        },
        {
          name: 'prefix',
          type: 'text',
          admin: {
            description: 'Optional prefix (e.g., "~")',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: false,
          admin: {
            description: 'Label for this statistic (e.g., "Team Members", "Company Growth")',
          },
        },
      ],
    },
  ],
  labels: {
    plural: 'Stats Blocks',
    singular: 'Stats Block',
  },
};
