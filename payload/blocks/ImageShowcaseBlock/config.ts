import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const ImageShowcaseBlock: Block = {
  slug: 'imageShowcase',
  interfaceName: 'ImageShowcaseBlock',
  labels: {
    singular: { en: 'Image Showcase', pt: 'Montra de Imagem' },
    plural: { en: 'Image Showcases', pt: 'Montras de Imagem' },
  },
  admin: {
    group: 'Media',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      interfaceName: 'ImageShowcaseBlockImage',
      label: { en: 'Images', pt: 'Imagens' },
      required: true,
      minRows: 2,
      labels: {
        singular: { en: 'Image', pt: 'Imagem' },
        plural: { en: 'Images', pt: 'Imagens' },
      },
      admin: {
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [PayloadImageField({ label: 'Image', name: 'image', required: true })],
    },
    {
      name: 'transitionDuration',
      type: 'number',
      label: { en: 'Transition Duration (ms)', pt: 'Duração da Transição (ms)' },
      defaultValue: 5000,
      min: 1000,
      max: 30000,
      admin: {
        description: {
          en: 'Time in milliseconds for each image to transition from grayscale to color (default: 5000ms)',
          pt: 'Tempo em milissegundos para cada imagem transitar de escala de cinzas para cor (padrão: 5000ms)',
        },
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: { en: 'Autoplay', pt: 'Reprodução Automática' },
      defaultValue: true,
      admin: {
        description: {
          en: 'Whether the image showcase should automatically transition between images.',
          pt: 'Se a montra de imagens deve transitar automaticamente entre imagens.',
        },
      },
    },
    {
      name: 'gridColumns',
      type: 'select',
      label: { en: 'Grid Columns', pt: 'Colunas da Grelha' },
      defaultValue: '2',
      options: [
        { label: { en: '1 Column', pt: '1 Coluna' }, value: '1' },
        { label: { en: '2 Columns', pt: '2 Colunas' }, value: '2' },
      ],
      admin: {
        description: {
          en: 'Number of columns to display in the thumbnail grid (default: 2). Note: For best results, use images with a 1:1 aspect ratio.',
          pt: 'Número de colunas a exibir na grelha de miniaturas (padrão: 2). Nota: Para melhores resultados, use imagens com proporção 1:1.',
        },
      },
    },
    SectionID,
  ],
};
