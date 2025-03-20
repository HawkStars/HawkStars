import { defineType } from 'sanity';

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  options: { modal: { type: 'dialog', width: 'auto' } },
  fields: [
    {
      name: 'title',
      type: 'internationalizedArrayString',
      title: 'Title',
      initialValue: '',
    },
    {
      name: 'paragraph',
      type: 'internationalizedArrayFormattedText',
      title: 'Paragraph',
      validation: (rule) => rule.required(),
    },
  ],
});
