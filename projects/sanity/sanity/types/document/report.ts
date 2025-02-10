import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'report',
  title: 'Report',
  type: 'document',
  fields: [
    defineField({
      name: 'erasmus',
      title: 'Erasmus + Project associated with',
      type: 'reference',
      to: { type: 'erasmus_project' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Detailed Report',
      type: 'internationalizedArrayFormattedText',
      description: 'More information for the erasmus project',
    }),
  ],
});
