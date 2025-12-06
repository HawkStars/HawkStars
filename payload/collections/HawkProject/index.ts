import type { CollectionConfig } from 'payload';
import { anyone } from '../../access/anyone';
import { authenticated } from '../../access/authenticated';
import HawkProjectFields from './HawkProjectFields';

export const HawkProject: CollectionConfig = {
  slug: 'hawk_projects',
  labels: {
    singular: 'Hawk Project',
    plural: 'Hawk Projects',
  },
  admin: {
    defaultColumns: ['heading', 'type_event', 'slug'],
    useAsTitle: 'heading',
    description: 'Collection for managing Hawk Projects',
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
      tabs: [HawkProjectFields],
    },
  ],
};
