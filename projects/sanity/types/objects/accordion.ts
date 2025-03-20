import { InternationalizedArrayString } from '@/projects/sanity/sanity.types';
import { defineType } from 'sanity';

export default defineType({
  name: 'accordion',
  title: 'Accordion',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'internationalizedArrayString',
      title: 'Title',
    },
    {
      name: 'values',
      type: 'internationalizedArrayFormattedText',
      title: 'Values',
    },
  ],
  options: { modal: { type: 'dialog', width: 'auto' } },
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const { title } = selection;
      const ptTitle = (title as InternationalizedArrayString).find((item) => item._key == 'pt');

      return {
        title: ptTitle?.value || '',
      };
    },
  },
});
