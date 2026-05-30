import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const ProjectTestimonialBlock: Block = {
  slug: 'projectTestimonialBlock',
  interfaceName: 'ProjectTestimonialBlock',
  admin: {
    group: 'Social Proof',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: { en: 'Title', pt: 'Título' },
      admin: {
        description: 'Optional section title',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      admin: {
        description: 'Optional section subtitle',
      },
    },
    {
      name: 'author',
      type: 'group',
      label: { en: 'Author', pt: 'Autor' },
      fields: [
        PayloadImageField({
          label: 'Profile Image',
          name: 'profileImage',
          required: true,
          description: 'Profile image of the person giving the testimonial',
        }),
        {
          name: 'name',
          type: 'text',
          required: true,
          label: { en: 'Name', pt: 'Nome' },
          admin: {
            description: 'Author full name',
          },
        },
        {
          name: 'role',
          type: 'text',
          localized: true,
          label: { en: 'Role', pt: 'Função' },
          admin: {
            description: 'Author role or position',
          },
        },
        {
          name: 'organization',
          type: 'text',
          label: { en: 'Organization', pt: 'Organização' },
          admin: {
            description: 'Company or organization',
          },
        },
      ],
    },
    {
      name: 'testimonial',
      type: 'textarea',
      required: true,
      localized: true,
      label: { en: 'Testimonial', pt: 'Testemunho' },
      admin: {
        description: 'The testimonial quote or review text',
      },
    },
    {
      name: 'projectMedia',
      type: 'group',
      label: { en: 'Project Media', pt: 'Média do Projeto' },
      admin: {
        description: 'Images showing the project group or related visuals',
      },
      fields: [
        {
          name: 'displayMode',
          type: 'select',
          label: { en: 'Display Mode', pt: 'Modo de Exibição' },
          options: [
            { label: { en: 'Single Image', pt: 'Imagem Única' }, value: 'single' },
            { label: { en: 'Slideshow', pt: 'Apresentação de Diapositivos' }, value: 'slideshow' },
          ],
          defaultValue: 'single',
          admin: {
            description: 'How to display project images',
          },
        },
        {
          name: 'images',
          type: 'array',
          interfaceName: 'ProjectTestimonialBlockImage',
          minRows: 1,
          required: true,
          label: { en: 'Images', pt: 'Imagens' },
          admin: {
            components: {
              RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
            },
          },
          labels: {
            singular: { en: 'Image', pt: 'Imagem' },
            plural: { en: 'Images', pt: 'Imagens' },
          },
          fields: [
            PayloadImageField({
              label: 'Image',
              name: 'image',
              required: true,
              hideGutter: true,
            }),
          ],
        },
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: true,
          label: { en: 'Autoplay', pt: 'Reprodução Automática' },
          admin: {
            description: 'Automatically cycle through images (slideshow mode only)',
            condition: (_, siblingData) => siblingData?.displayMode === 'slideshow',
          },
        },
        {
          name: 'autoplayInterval',
          type: 'number',
          min: 2000,
          max: 10000,
          defaultValue: 4000,
          label: { en: 'Autoplay Interval', pt: 'Intervalo de Reprodução' },
          admin: {
            description: 'Time between slides in milliseconds',
            condition: (_, siblingData) =>
              siblingData?.displayMode === 'slideshow' && siblingData?.autoplay === true,
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: { en: 'Layout', pt: 'Disposição' },
      options: [
        { label: { en: 'Image Left', pt: 'Imagem à Esquerda' }, value: 'imageLeft' },
        { label: { en: 'Image Right', pt: 'Imagem à Direita' }, value: 'imageRight' },
      ],
      defaultValue: 'imageRight',
      admin: {
        description: 'Position of the project images relative to the testimonial',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: { en: 'Background Color', pt: 'Cor de Fundo' },
      options: [
        { label: { en: 'None (transparent)', pt: 'Nenhuma (transparente)' }, value: 'none' },
        { label: { en: 'Light', pt: 'Claro' }, value: 'light' },
        { label: { en: 'Dark', pt: 'Escuro' }, value: 'dark' },
        { label: { en: 'Brand', pt: 'Marca' }, value: 'brand' },
      ],
      defaultValue: 'none',
      admin: {
        description: 'Background color for the section',
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Project Testimonial Blocks', pt: 'Blocos de Testemunho de Projeto' },
    singular: { en: 'Project Testimonial Block', pt: 'Bloco de Testemunho de Projeto' },
  },
};
