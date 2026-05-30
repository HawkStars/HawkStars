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
      label: { en: 'Title', pt: 'Título' },
      admin: {
        description: 'Section heading displayed above the event',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      admin: {
        description: 'Optional section description',
      },
    },
    {
      name: 'eventType',
      type: 'select',
      hasMany: true,
      label: { en: 'Event Type', pt: 'Tipo de Evento' },
      options: [
        { label: { en: 'Local Event', pt: 'Evento Local' }, value: 'local_event' },
        { label: { en: 'International Event', pt: 'Evento Internacional' }, value: 'international_event' },
        { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
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
      label: { en: 'Link Label', pt: 'Rótulo do Link' },
      admin: {
        description: 'Label for the link to the event page',
      },
    },
    SectionID,
  ],
  labels: {
    singular: { en: 'Upcoming Hawk Event', pt: 'Próximo Evento Hawk' },
    plural: { en: 'Upcoming Hawk Event Blocks', pt: 'Blocos de Próximo Evento Hawk' },
  },
};
