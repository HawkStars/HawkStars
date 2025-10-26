import { Tab } from 'payload';

const HawkEventFields: Tab = {
  label: 'Details',
  description: 'Information about the Hawk Event',
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true, localized: true },
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
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'Image representing the event on the events main page not on the event page itself',
      },
    },
  ],
};

export default HawkEventFields;
