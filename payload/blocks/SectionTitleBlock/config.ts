import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

export const SectionTitleBlock: Block = {
  slug: 'sectionTitleBlock',
  interfaceName: 'SectionTitleBlock',
  labels: {
    singular: { en: 'Section Title', pt: 'Título de Secção' },
    plural: { en: 'Section Titles', pt: 'Títulos de Secção' },
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Título' },
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      required: false,
      localized: true,
    },
    SectionID,
  ],
};
