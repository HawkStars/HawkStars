import { defineType } from 'sanity';

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'internationalizedArrayString',
      title: 'Title',
    },
    {
      name: 'paragraph',
      type: 'internationalizedArrayFormattedText',
      title: 'Paragraph',
      validation: (rule) => rule.required(),
    },
  ],
});
