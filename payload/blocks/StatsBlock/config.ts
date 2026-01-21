import SectionID from '@/payload/fields/SectionID';
import { linkGroup } from '@/payload/fields/linkGroup';
import { icons } from 'lucide-react';
import type { Block } from 'payload';

export const StatsBlock: Block = {
  slug: 'statsBlock',
  interfaceName: 'StatsBlock',
  fields: [
    {
      name: 'columns',
      type: 'select',
      required: true,
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
        { label: '5 Columns', value: '5' },
      ],
      admin: {
        description: 'Number of stat cards per row',
      },
    },
    {
      name: 'background',
      type: 'select',
      required: true,
      defaultValue: 'white',
      options: [
        { label: 'White (Black Text)', value: 'white' },
        { label: 'Bege (Black Text)', value: 'bege' },
        { label: 'Green (White Text)', value: 'green' },
      ],
      admin: {
        description: 'Background color for the section',
      },
    },
    {
      name: 'hoverBorderColor',
      type: 'select',
      required: true,
      defaultValue: 'green',
      options: [
        { label: 'Green', value: 'green' },
        { label: 'Bege', value: 'bege' },
      ],
      admin: {
        description: 'Border color on card hover',
      },
    },
    {
      name: 'stats',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon (Lucide)',
          admin: {
            description: 'Optional icon from Lucide (https://lucide.dev/icons/)',
          },
          options: Object.keys(icons).map((iconKey) => ({
            label: iconKey,
            value: iconKey,
          })),
        },
        {
          name: 'iconAlign',
          type: 'select',
          label: 'Icon Alignment',
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Horizontal alignment of the icon',
            condition: (_, siblingData) => !!siblingData?.icon,
          },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          admin: {
            description: 'Optional stat title or value (e.g., "500+", "10K Users")',
          },
        },
        {
          name: 'titleAlign',
          type: 'select',
          label: 'Title Alignment',
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Horizontal alignment of the title',
            condition: (_, siblingData) => !!siblingData?.title,
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Optional description or label for the stat',
          },
        },
        {
          name: 'descriptionAlign',
          type: 'select',
          label: 'Description Alignment',
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Horizontal alignment of the description',
            condition: (_, siblingData) => !!siblingData?.description,
          },
        },
      ],
      admin: {
        description: 'List of stat cards to display',
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          description: 'Optional CTA buttons (max 2)',
        },
      },
    }),
    SectionID,
  ],
  labels: {
    plural: 'Stats Blocks',
    singular: 'Stats Block',
  },
};
