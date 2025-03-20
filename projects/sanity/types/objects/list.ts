import { defineType } from 'sanity';

export default defineType({
  name: 'list',
  title: 'List',
  type: 'object',
  options: { modal: { type: 'dialog', width: 'auto' } },
  fields: [
    {
      name: 'title',
      type: 'internationalizedArrayString',
      title: 'Title',
    },
    {
      name: 'list_values',
      type: 'array',
      of: [{ type: 'accordion' }],
      title: 'List Values',
    },
  ],
});
