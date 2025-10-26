import { Tab } from 'payload';

const CuratorFieldsTab: Tab = {
  label: 'Curator Details',
  description: 'Information about the curator',
  fields: [
    {
      type: 'text',
      name: 'name',
      label: 'Curator Name',
      required: true,
      hooks: {
        afterChange: [
          ({ data }) => {
            return { slug: data?.name.replace(/\s+/g, '-').toLowerCase() || ' ' };
          },
        ],
      },
    },
    {
      type: 'text',
      name: 'slug',
      label: 'Slug',
      unique: true,
      required: true,
    },
    { type: 'text', name: 'location', label: 'Location' },
    {
      type: 'richText',
      name: 'description',
      label: 'Biographical Note',
      localized: true,
    },
    { type: 'upload', name: 'image', label: 'Image', relationTo: 'media', required: true },
  ],
};
export default CuratorFieldsTab;
