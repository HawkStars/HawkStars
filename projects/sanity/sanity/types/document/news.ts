import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  description: 'Model to be used for any news from hawkstars',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Title of the news',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Url que vai ser usado como hawkstars.org/news/[SLUG]',
      type: 'slug',
      hidden: ({ document }) => !document?.title,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayFormattedText',
      description: 'More information for the news',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'cloudinary.asset' }],
    }),
  ],
});
