import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  deprecated: { reason: 'Not yet being used on the website' },
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
    }),
    defineField({
      name: 'type_event',
      title: 'Type Event',
      type: 'string',
      options: {
        list: [
          { title: 'Erasmus +', value: 'erasmus' },
          { title: 'Local Event', value: 'local_event' },
          { title: 'International Event', value: 'international_event' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayFormattedText',
      description: 'More information for the event',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'cloudinary.asset' }],
    }),
  ],
});
