import { defineField, defineType } from 'sanity';
import { TaskIcon } from '@sanity/icons';

export default defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  description: 'Model to be used for any news from hawkstars',
  icon: TaskIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description: 'Name of the partner',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'cloudinary.asset' }],
    }),
  ],
});
