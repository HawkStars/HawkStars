import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const TeamGridBlock: Block = {
  slug: 'teamGrid',
  interfaceName: 'TeamGridBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Our Team',
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'members',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'role',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'bio',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'linkedIn',
          type: 'text',
        },
        {
          name: 'twitter',
          type: 'text',
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: '2 Columns', value: 'cols-2' },
        { label: '3 Columns', value: 'cols-3' },
        { label: '4 Columns', value: 'cols-4' },
      ],
      defaultValue: 'cols-3',
    },
    SectionID,
  ],
  labels: {
    plural: 'Team Grids',
    singular: 'Team Grid',
  },
};
