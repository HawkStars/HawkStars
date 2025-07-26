import type { CollectionConfig } from 'payload';

export const HawkEvent: CollectionConfig = {
  slug: 'hawk_events',
  labels: {
    singular: 'Hawk Event',
    plural: 'Hawk Events',
  },
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      required: true,
      hooks: { beforeChange: [({ data }) => data?.title?.replace(/\s+/g, '-').toLowerCase()] },
    },
    {
      name: 'type_event',
      label: 'Type of Event',
      type: 'select',
      options: [
        { label: 'Erasmus +', value: 'erasmus' },
        { label: 'Local Event', value: 'local_event' },
        { label: 'International Event', value: 'international_event' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'description', label: 'Description', type: 'text', localized: true },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media', required: true },
  ],
};
