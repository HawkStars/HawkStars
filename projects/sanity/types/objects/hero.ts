import { defineType } from 'sanity';
import { HeroPreview } from '../../components/HeroPreview';

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
  components: {
    preview: HeroPreview,
  },
});
