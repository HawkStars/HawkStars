import type { CollectionConfig } from 'payload';
import { anyone } from '../../access/anyone';
import { authenticated } from '../../access/authenticated';
import HawkProjectPageTab from './HawkProjectPageTab';
import { sanitizeBrokenImageRelationship } from '../../hooks/sanitizeBrokenImageRelationship';

export const HawkProject: CollectionConfig = {
  slug: 'hawk_projects',
  labels: {
    singular: 'Hawk Project',
    plural: 'Hawk Projects',
  },
  admin: {
    defaultColumns: ['type_event', 'slug'],
    description:
      'Manage HawkStars projects and events. Add project details, images, and descriptions. Each project gets its own public page based on its slug.',
    group: {
      name: 'Daily Work',
    },
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
      label: 'Hawk Project Details',
      tabs: [HawkProjectPageTab],
    },
  ],
};
