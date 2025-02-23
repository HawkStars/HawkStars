import { defineField, defineType } from 'sanity';
import { ProjectsIcon } from '@sanity/icons';

export default defineType({
  name: 'erasmus_project',
  title: 'Erasmus Project',
  type: 'document',
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title of the Project',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Url for the Erasmus',
      description: 'the url that is used to show the information on the website',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayFormattedText',
      description: 'More information for the erasmus project',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'cloudinary.asset' }],
    }),
  ],
});
