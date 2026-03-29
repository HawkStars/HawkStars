import { PayloadImageField } from '@/payload/fields/ImageType';
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
    { name: 'description', label: 'Description', type: 'textarea', localized: true },
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
      name: 'date',
      label: 'Event Date',
      type: 'date',
      required: true,
      admin: {
        description: 'The date when this event/project takes place',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
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
    { name: 'page_content', label: 'Page Content', type: 'richText', localized: true },
    PayloadImageField({
      label: 'Image',
      name: 'image',
      required: true,
      description:
        'Image representing the event on the events main page not on the event page itself',
    }),
  ],
};

export default HawkProjectDetails;
