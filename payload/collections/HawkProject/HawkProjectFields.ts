import { PayloadImageField } from '@/payload/fields/ImageType';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Tab } from 'payload';

const HawkProjectDetails: Tab = {
  label: 'Details',
  description: 'Information about the Hawk Event',
  admin: {
    description: 'Configure the details for the Hawk Event here',
  },
  fields: [
    { name: 'heading', label: 'Title', type: 'text', required: true, localized: true },
    { name: 'subheading', label: 'Subtitle', type: 'text', localized: true },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Short description shown on the homepage top' },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      required: true,
      hooks: {
        beforeChange: [({ data }) => data?.title?.replace(/\s+/g, '-').toLowerCase()],
      },
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
    {
      name: 'type_event',
      label: 'Type of Event',
      type: 'select',
      defaultValue: 'erasmus',
      options: [
        { label: 'Erasmus +', value: 'erasmus' },
        { label: 'Local Event', value: 'local_event' },
        { label: 'International Event', value: 'international_event' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'page_content',
      label: 'Page Content',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({}),
    },
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

export default HawkProjectDetails;
