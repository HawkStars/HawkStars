import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const EventListBlock: Block = {
  slug: 'eventList',
  interfaceName: 'EventListBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Upcoming Events',
      admin: {
        description: 'Section title',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      admin: {
        description: 'Section description',
      },
    },
    {
      name: 'events',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            description: 'Optional end date for multi-day events',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'location',
          type: 'text',
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Workshop', value: 'workshop' },
            { label: 'Meeting', value: 'meeting' },
            { label: 'Fundraiser', value: 'fundraiser' },
            { label: 'Social', value: 'social' },
            { label: 'Community', value: 'community' },
            { label: 'Youth Program', value: 'youth' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'registrationLink',
          type: 'text',
          admin: {
            description: 'Link to registration or more info',
          },
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'maxParticipants',
          type: 'number',
          admin: {
            description: 'Maximum number of participants (optional)',
          },
        },
        {
          name: 'spotsRemaining',
          type: 'number',
          admin: {
            description: 'Number of spots remaining',
          },
        },
      ],
      admin: {
        description: 'List of events to display',
      },
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: 'List View', value: 'list' },
        { label: 'Grid Cards', value: 'grid' },
        { label: 'Timeline', value: 'timeline' },
      ],
      defaultValue: 'list',
    },
    {
      name: 'showPastEvents',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Include past events in the list',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Event Lists',
    singular: 'Event List',
  },
};
