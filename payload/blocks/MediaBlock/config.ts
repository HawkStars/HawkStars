import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  admin: {
    group: 'Media',
  },
  fields: [PayloadImageField({ name: 'media', label: 'Média', required: true }), SectionID],
  labels: {
    singular: { en: 'Media Block', pt: 'Bloco de Média' },
    plural: { en: 'Media Blocks', pt: 'Blocos de Média' },
  },
};
