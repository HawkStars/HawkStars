import type { CollectionConfig, Tab } from 'payload';
import { anyone } from '../../access/anyone';
import { authenticated } from '../../access/authenticated';
import HawkEventFields from './HawkEventFields';

export const HawkEvent: CollectionConfig = {
  slug: 'hawk_events',
  labels: {
    singular: 'Hawk Event',
    plural: 'Hawk Events',
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
