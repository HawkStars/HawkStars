import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

export const SectionTitleBlock: Block = {
  slug: 'sectionTitleBlock',
  interfaceName: 'SectionTitleBlock',
  labels: {
    singular: 'Section Title',
    plural: 'Section Titles',
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      required: false,
      localized: true,
    },
    SectionID,
  ],
};
