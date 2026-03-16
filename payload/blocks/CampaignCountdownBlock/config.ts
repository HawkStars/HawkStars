import { linkGroup } from '@/payload/fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const CampaignCountdownBlock: Block = {
  slug: 'campaignCountdown',
  interfaceName: 'CampaignCountdownBlock',
  admin: {
    group: 'CTA & Engagement',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Campaign or event title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
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
    linkGroup({ overrides: { maxRows: 2 } }),
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
      localized: true,
      admin: {
        description: 'Message to show when countdown reaches zero',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Campaign Countdowns',
    singular: 'Campaign Countdown',
  },
};
