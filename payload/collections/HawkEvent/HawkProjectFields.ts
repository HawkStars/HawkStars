import { PayloadImageField } from '@/payload/fields/ImageType';
import { MultiImageField } from '@/payload/fields/MultiImage';
import { Tab } from 'payload';

const HawkEventDetails: Tab = {
  label: 'Details',
  description: 'Information about the Hawk Event',
  admin: {
    description: 'Configure the details for the Hawk Event here',
  },
  fields: [
    { name: 'heading', label: 'Title', type: 'text', required: true, localized: true },
    { name: 'subheading', label: 'Subtitle', type: 'text', localized: true },
    {
      label: 'General Information',
      type: 'group',
      fields: [
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          localized: true,
          admin: { description: 'Short description shown on the homepage top' },
        },
        {
          name: 'isDateRange',
          label: 'Multi-day Event',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable if the event spans more than one day',
          },
        },
        {
          name: 'date',
          label: 'Event Date / Start Date',
          type: 'date',
          required: true,
          admin: {
            description: 'Event date, or the first day for multi-day events',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
        {
          name: 'endDate',
          label: 'End Date',
          type: 'date',
          admin: {
            description: 'Last day of the event (only for multi-day events)',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
            condition: (_, siblingData) => Boolean(siblingData?.isDateRange),
          },
        },
      ],
    },

    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      required: true,
      hooks: {
        beforeChange: [({ data }) => data?.heading?.replace(/\s+/g, '-').toLowerCase()],
      },
    },

    {
      name: 'type_event',
      label: 'Type of Event',
      type: 'select',
      defaultValue: 'local_event',
      options: [
        { label: 'Local Event', value: 'local_event' },
        { label: 'International Event', value: 'international_event' },
        { label: 'Other', value: 'other' },
      ],
    },
    /* -------------------------------------------------------------- */
    /*  PAGE CONTENT — structured fields replacing rich text          */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'details',
      label: 'Description',
      admin: {
        description: 'Main body content shown on the public event page.',
      },
      fields: [
        {
          name: 'text',
          label: 'Main Text',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Main paragraph describing the event in detail',
            rows: 8,
          },
        },
        {
          name: 'sections',
          label: 'Additional Sections',
          type: 'array',
          interfaceName: 'HawkEventSection',
          admin: {
            description: 'Titled sections for extra content (e.g. "Activities", "Outcomes")',
            initCollapsed: true,
          },
          fields: [
            {
              name: 'title',
              label: 'Section Title',
              type: 'text',
              localized: true,
            },
            {
              name: 'text',
              label: 'Section Text',
              type: 'textarea',
              localized: true,
              admin: { rows: 6 },
            },
          ],
        },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  PROGRAM / SCHEDULE                                            */
    /* -------------------------------------------------------------- */
    {
      name: 'program',
      label: 'Program / Schedule',
      type: 'array',
      interfaceName: 'HawkEventProgramItem',
      admin: {
        description: 'Day-by-day or session-by-session schedule of the event',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'day',
          label: 'Day / Time',
          type: 'text',
          localized: false,
          admin: { description: 'e.g. "Day 1", "09:00–10:30"', width: '30%' },
        },
        {
          name: 'title',
          label: 'Activity Title',
          type: 'text',
          localized: true,
          admin: { width: '70%' },
        },
        {
          name: 'description',
          label: 'Activity Description',
          type: 'textarea',
          localized: true,
          admin: { rows: 3 },
        },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  OBJECTIVES                                                    */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'objectives',
      label: 'Objectives',
      admin: {
        description: 'List of goals or learning outcomes for the event.',
      },
      fields: [
        {
          name: 'introduction',
          label: 'Introduction',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Short introductory paragraph before the objectives list',
            rows: 4,
          },
        },
        {
          name: 'items',
          label: 'Objective Items',
          type: 'array',
          interfaceName: 'HawkEventObjectiveItem',
          admin: { initCollapsed: true },
          fields: [
            {
              name: 'text',
              label: 'Objective',
              type: 'textarea',
              localized: true,
              required: true,
            },
          ],
        },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  PHOTO GALLERY                                                 */
    /* -------------------------------------------------------------- */
    MultiImageField({
      name: 'gallery',
      label: 'Photo Gallery',
      description: 'Photos displayed at the bottom of the event page',
    }),

    PayloadImageField({
      label: 'Image',
      name: 'image',
      required: true,
      description:
        'Image representing the event on the events main page not on the event page itself',
    }),
    {
      name: 'instagram',
      label: 'Instagram ID',
      type: 'text',
      admin: { description: 'Only the ID, not the full URL', components: {} },
    },
  ],
};

export default HawkEventDetails;
