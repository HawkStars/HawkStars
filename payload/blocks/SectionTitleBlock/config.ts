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
      name: 'eyebrow',
      type: 'text',
      localized: true,
      label: { en: 'Eyebrow label', pt: 'Etiqueta' },
      admin: {
        description: {
          en: 'Short uppercase label shown above the title, e.g. "Main programmes". Leave empty to show just the accent rule.',
          pt: 'Etiqueta curta em maiúsculas mostrada acima do título, ex. "Programas principais". Deixe vazio para mostrar apenas a linha de destaque.',
        },
      },
    },
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
