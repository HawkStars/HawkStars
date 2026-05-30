import type { Block } from 'payload';

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import SectionID from '@/payload/fields/SectionID';
import { PayloadImageField } from '@/payload/fields/ImageType';
import { SectionListBlock } from '../SectionListBlock/config';

export const ContentWithImage: Block = {
  slug: 'contentWithImage',
  interfaceName: 'ContentWithImageBlock',
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
      name: 'description',
      type: 'richText',
      label: { en: 'Description', pt: 'Descrição' },
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          BlocksFeature({
            blocks: [SectionListBlock],
            inlineBlocks: [],
          }),
        ],
      }),
      required: true,
    },
    PayloadImageField({ name: 'image', label: 'Image', required: true }),
    {
      name: 'imagePosition',
      type: 'select',
      label: { en: 'Image Position', pt: 'Posição da Imagem' },
      options: [
        {
          label: { en: 'Left', pt: 'Esquerda' },
          value: 'left',
        },
        {
          label: { en: 'Right', pt: 'Direita' },
          value: 'right',
        },
      ],
      defaultValue: 'right',
      admin: {
        description: 'Position of the image relative to the content',
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Content with Image Blocks', pt: 'Blocos de Conteúdo com Imagem' },
    singular: { en: 'Content with Image Block', pt: 'Bloco de Conteúdo com Imagem' },
  },
};
