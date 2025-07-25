import { BlockComponent } from '../../components/items/BoardMemberItem';

import { defineType } from 'sanity';
import { CropIcon } from '@sanity/icons';

export default defineType({
  name: 'accordion',
  title: 'Accordion',
  type: 'object',
  icon: CropIcon,
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
      values: 'values',
    },
  },
  components: {
    // preview: BlockComponent,
    block: BlockComponent,
    inlineBlock: BlockComponent,
  },
});
