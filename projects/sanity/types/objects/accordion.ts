import { defineType } from 'sanity';
import AccordionPreview from '../../components/objects/AccordionPreview';

export default defineType({
  name: 'accordion',
  title: 'Accordion',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'values',
      type: 'array',
      of: [{ type: 'block' }],
      title: 'Values',
    },
  ],
  options: { modal: { type: 'dialog', width: 'auto' } },
  preview: {
    select: {
      title: 'title',
    },
  },
  components: {
    preview: AccordionPreview,
  },
});
