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
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Título' },
      localized: true,
      admin: {
        description: {
          en: 'Optional heading above the showcase.',
          pt: 'Título opcional acima da montra.',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Description', pt: 'Descrição' },
      localized: true,
      admin: {
        description: {
          en: 'Optional supporting text below the title.',
          pt: 'Texto de apoio opcional abaixo do título.',
        },
      },
    },
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
      fields: [
        PayloadImageField({ label: 'Image', name: 'image', required: true }),
        {
          name: 'caption',
          type: 'text',
          label: { en: 'Caption', pt: 'Legenda' },
          localized: true,
          admin: {
            description: {
              en: 'Shown over the image. Leave empty for no caption — the alt text stays for screen readers only.',
              pt: 'Mostrada sobre a imagem. Deixe vazio para não ter legenda — o texto alternativo fica só para leitores de ecrã.',
            },
          },
        },
      ],
    },
    {
      name: 'transitionDuration',
      type: 'number',
      label: { en: 'Time per Image (ms)', pt: 'Tempo por Imagem (ms)' },
      defaultValue: 5000,
      min: 1000,
      max: 30000,
      admin: {
        description: {
          en: 'How long each image stays on screen during autoplay (default: 5000ms).',
          pt: 'Quanto tempo cada imagem fica no ecrã durante a reprodução automática (padrão: 5000ms).',
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
          en: 'Advance through the images automatically. Pauses while the visitor hovers or focuses the showcase.',
          pt: 'Avançar pelas imagens automaticamente. Pausa enquanto o visitante passa o rato ou foca a montra.',
        },
      },
    },
    SectionID,
  ],
};
