import type { CollectionConfig } from 'payload';
import { anyone } from '../../access/anyone';
import { authenticated } from '../../access/authenticated';
import HawkEventFields from './HawkEventFields';

export const HawkEvent: CollectionConfig = {
  slug: 'hawk_events',
  labels: {
    singular: 'Hawk Event',
    plural: 'Hawk Events',
  },
  admin: {
    defaultColumns: ['title', 'type_event', 'slug'],
    useAsTitle: 'title',
    description: 'Collection for managing Hawk Events',
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
  fields: [
    {
      type: 'tabs',
      label: 'Hawk Event Details',
      tabs: [HawkEventFields],
    },
  ],
};
