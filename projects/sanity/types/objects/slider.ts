import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'slider',
  type: 'object',
  title: 'Slider',
  options: { modal: { type: 'dialog', width: 'auto' } },
  fields: [
    defineField({
      name: 'slides',
      type: 'array',
      of: [{ type: 'slide' }],
    }),
  ],
});
