import { BlockComponent } from '../../components/items/BoardMemberItem';
import AccordionBlock from '../../components/objects/AccordionBlock';
import { defineType } from 'sanity';

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
    block: AccordionBlock,
    preview: BlockComponent,
  },
});
