import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const AgendaBlock: Block = {
  slug: 'agenda',
  interfaceName: 'AgendaBlock',
  admin: {
    group: 'News & Events',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      localized: true,
      admin: {
        description: 'Heading displayed above the event list',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Section Subtitle',
      localized: true,
      admin: {
        description: 'Optional description shown below the title',
      },
    },
    {
      name: 'eventType',
      type: 'select',
      label: 'Event Type',
      hasMany: true,
      options: [
        { label: 'Erasmus +', value: 'erasmus' },
        { label: 'Local Event', value: 'local_event' },
        { label: 'International Event', value: 'international_event' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description:
          'Filter by event type. Leave empty to show all upcoming events regardless of type.',
      },
    },
    {
      name: 'maxEvents',
      type: 'number',
      label: 'Maximum Events to Show',
      defaultValue: 5,
      admin: {
        description: 'Maximum number of upcoming events to display (1–20)',
        step: 1,
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) return true;
        if (value < 1) return 'Must be at least 1';
        if (value > 20) return 'Cannot exceed 20';
        return true;
      },
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'list',
      options: [
        { label: 'List (default)', value: 'list' },
        { label: 'Compact', value: 'compact' },
        { label: 'Cards', value: 'cards' },
      ],
      admin: {
        description: 'Visual style for the event list',
      },
    },
    {
      name: 'linkLabel',
      type: 'text',
      label: 'Link Label',
      defaultValue: 'Ver mais',
      localized: true,
      admin: {
        description: 'Text for the "learn more" link on each event card',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Agenda Blocks',
    singular: 'Agenda Block',
  },
};
