import type { CollectionConfig } from 'payload';

export const Curator: CollectionConfig = {
  slug: 'curators',
  fields: [
    { type: 'text', name: 'name', label: 'Curator Name', required: true },
    {
      type: 'text',
      name: 'slug',
      label: 'Slug',
      unique: true,
      required: true,
      hooks: { beforeChange: [({ data }) => data?.title?.replace(/\s+/g, '-').toLowerCase()] },
    },
    { type: 'text', name: 'location', label: 'Location' },
    {
      type: 'text',
      name: 'description',
      label: 'Biographical Note',
      localized: true,
    },
    { type: 'upload', name: 'image', label: 'Image', relationTo: 'media', required: true },
  ],
};
