import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'slide',
  type: 'object',
  title: 'Slide',
  options: { modal: { type: 'dialog', width: 'auto' } },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'hero',
      title: 'Slide Image',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
  },
});
