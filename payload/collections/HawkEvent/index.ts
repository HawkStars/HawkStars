import type { CollectionConfig } from 'payload';
import { anyone } from '../../access/anyone';
import { authenticated } from '../../access/authenticated';
import { sanitizeBrokenImageRelationship } from '../../hooks/sanitizeBrokenImageRelationship';
import HawkProjectFields from './HawkProjectFields';

export const HawkEvent: CollectionConfig = {
  slug: 'hawk_events',
  labels: {
    singular: { en: 'Hawk Event', pt: 'Evento Hawk' },
    plural: { en: 'Hawk Events', pt: 'Eventos Hawk' },
  },
  admin: {
    defaultColumns: ['type_event', 'slug'],
    useAsTitle: 'heading',
    description:
      'Manage HawkStars projects and events. Add event details, images, and descriptions. Each project gets its own public page based on its slug.',
    group: {
      name: 'Daily Work',
    },
    preview: (doc) => `/events/${doc.slug}`,
  },
  defaultPopulate: {
    slug: true,
  },
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    delete: authenticated,
    update: authenticated,
  },
  hooks: {
    afterRead: [sanitizeBrokenImageRelationship],
  },
  fields: [
    {
      type: 'tabs',
      label: 'Hawk Event Details',
      tabs: [HawkProjectFields],
    },
  ],
};
