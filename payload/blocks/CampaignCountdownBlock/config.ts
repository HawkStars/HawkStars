import type { Block } from 'payload';

export const CampaignCountdownBlock: Block = {
  slug: 'campaignCountdown',
  interfaceName: 'CampaignCountdownBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Campaign or event title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description or urgency message',
      },
    },
    {
      name: 'targetDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Target end date for the countdown',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Take Action',
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
      name: 'showDays',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showHours',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showMinutes',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showSeconds',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'theme',
      type: 'select',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Urgent (Red)', value: 'urgent' },
      ],
      defaultValue: 'light',
      admin: {
        description: 'Visual theme',
      },
    },
    {
      name: 'completedMessage',
      type: 'text',
      defaultValue: 'Campaign Ended',
      admin: {
        description: 'Message to show when countdown reaches zero',
      },
    },
  ],
  labels: {
    plural: 'Campaign Countdowns',
    singular: 'Campaign Countdown',
  },
};
