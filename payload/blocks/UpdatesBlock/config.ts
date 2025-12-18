import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const UpdatesBlock: Block = {
  slug: 'updatesBlock',
  interfaceName: 'UpdatesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Section heading (e.g. Resources & Whitepapers)' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Section description (e.g. Explore our thoughts...)' },
    },
    {
      name: 'categories',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'Category name (e.g. Data, AI, Security, News)' },
        },
      ],
      admin: { description: 'Categories for filtering updates' },
    },
    {
      name: 'latestUpdates',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'category', type: 'text', required: true },
        { name: 'date', type: 'text', required: true },
        {
          name: 'authors',
          type: 'array',
          minRows: 1,
          fields: [{ name: 'avatar', type: 'text', required: true }],
        },
        { name: 'link', type: 'text', required: true },
      ],
      admin: { description: 'Latest updates for the tabbed section' },
    },
    SectionID,
  ],
  labels: {
    plural: 'Updates Blocks',
    singular: 'Updates Block',
  },
};
