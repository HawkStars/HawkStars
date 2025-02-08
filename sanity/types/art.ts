import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'art',
  title: 'Art',
  type: 'document',
  groups: [
    {
      name: 'text',
      title: 'Text',
    },
    {
      name: 'media',
      title: 'Media',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
      group: ['text'],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: ['text'],
      options: {
        source: 'name',
      },
      hidden: ({ document }) => !document?.name,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      group: ['text'],
      type: 'internationalizedArrayFormattedText',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      group: ['media'],
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'is_sold',
      title: 'Vendido?',
      type: 'boolean'
    })
  ],
});
