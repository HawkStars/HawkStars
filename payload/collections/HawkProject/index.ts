import type { CollectionConfig } from 'payload';
import { anyone } from '../../access/anyone';
import { authenticated } from '../../access/authenticated';
import HawkProjectFields from './HawkProjectFields';
import { sanitizeBrokenImageRelationship } from '../../hooks/sanitizeBrokenImageRelationship';

export const HawkProject: CollectionConfig = {
  slug: 'hawk_projects',
  labels: {
    singular: 'Hawk Project',
    plural: 'Hawk Projects',
  },
  admin: {
    defaultColumns: ['heading', 'type_event', 'slug'],
    useAsTitle: 'heading',
    description:
      'Manage HawkStars projects and events. Add event details, images, and descriptions. Each project gets its own public page based on its slug.',
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
