import type { Block } from 'payload';

export const Projects18Block: Block = {
  slug: 'projects18',
  interfaceName: 'Projects18Block',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Section Subtitle',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      localized: true,
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'hawk_projects',
      hasMany: true,
      label: 'Projects to Display',
      required: true,
      admin: {
        description: 'Select the projects you want to display in this block',
      },
    },
  ],
  labels: {
    singular: 'Projects18 Block',
    plural: 'Projects18 Blocks',
  },
};
