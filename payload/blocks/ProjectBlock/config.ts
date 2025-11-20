import type { Block } from 'payload';

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';

export const ProjectBlock: Block = {
  slug: 'projectBlock',
  interfaceName: 'ProjectBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: false,
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h3', 'h4', 'h5', 'h6'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
      localized: false,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main project image',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Planning',
          value: 'planning',
        },
        {
          label: 'In Progress',
          value: 'in-progress',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'On Hold',
          value: 'on-hold',
        },
      ],
      required: true,
      defaultValue: 'planning',
    },
    {
      name: 'progress',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        description: 'Project completion percentage (0-100)',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        description: 'Project start date',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'Project completion date (actual or estimated)',
      },
    },
    {
      name: 'budget',
      type: 'group',
      fields: [
        {
          name: 'total',
          type: 'number',
          admin: {
            description: 'Total project budget',
          },
        },
        {
          name: 'raised',
          type: 'number',
          admin: {
            description: 'Amount raised so far',
          },
        },
        {
          name: 'currency',
          type: 'text',
          defaultValue: '€',
          admin: {
            description: 'Currency symbol',
          },
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'team',
      type: 'array',
      fields: [
        {
          name: 'member',
          type: 'relationship',
          relationTo: 'board-members',
        },
        {
          name: 'role',
          type: 'text',
          admin: {
            description: 'Role in this project',
          },
        },
      ],
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            {
              label: 'Website',
              value: 'website',
            },
            {
              label: 'Documentation',
              value: 'docs',
            },
            {
              label: 'Repository',
              value: 'repo',
            },
            {
              label: 'Other',
              value: 'other',
            },
          ],
          defaultValue: 'website',
        },
      ],
    },
  ],
  labels: {
    plural: 'Project Blocks',
    singular: 'Project Block',
  },
};
