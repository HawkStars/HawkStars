import { defineField, defineType } from 'sanity';
import { UsersIcon } from '@sanity/icons';

export default defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  description: 'Model to be used for any news from hawkstars',
  icon: UsersIcon,
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
      type: 'cloudinary.asset',
    }),
  ],
});
