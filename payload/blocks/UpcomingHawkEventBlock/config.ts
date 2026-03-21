import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const UpcomingHawkEventBlock: Block = {
  slug: 'upcomingHawkEvent',
  interfaceName: 'UpcomingHawkEventBlock',
  admin: {
    group: 'News & Events',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Upcoming Event',
      localized: true,
      admin: {
        description: 'Section heading displayed above the event',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optional section description',
      },
    },
    {
      name: 'eventType',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Erasmus +', value: 'erasmus' },
        { label: 'Local Event', value: 'local_event' },
        { label: 'International Event', value: 'international_event' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description:
          'Filter by event type. Leave empty to show the next upcoming event regardless of type.',
      },
    },
    {
      name: 'linkLabel',
      type: 'text',
      defaultValue: 'Learn more',
      localized: true,
      admin: {
        description: 'Label for the link to the event page',
      },
    },
    SectionID,
  ],
  labels: {
    singular: 'Upcoming Hawk Event',
    plural: 'Upcoming Hawk Event Blocks',
  },
};
