import { PayloadImageField } from '@/payload/fields/ImageType';
import { MultiImageField } from '@/payload/fields/MultiImage';
import { Tab } from 'payload';

const NewsDetails: Tab = {
  label: { en: 'Details', pt: 'Detalhes' },
  description: 'Information about the News article',
  admin: {
    description: 'Configure the details for the News article here',
  },
  fields: [
    {
      name: 'title',
      label: { en: 'Title', pt: 'Título' },
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'The title of the news article',
      },
    },
    {
      name: 'type',
      label: { en: 'Type', pt: 'Tipo' },
      type: 'select',
      defaultValue: 'blog',
      required: true,
      options: [
        { label: 'Blog', value: 'blog' },
        { label: { en: 'News', pt: 'Notícia' }, value: 'news' },
        { label: { en: 'Press Release', pt: 'Comunicado de Imprensa' }, value: 'press_release' },
        { label: { en: 'Announcement', pt: 'Anúncio' }, value: 'announcement' },
        { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
      ],
      admin: {
        description: 'The type of the news article',
      },
    },
    PayloadImageField({
      label: 'Imagem de Capa',
      name: 'mainImage',
      required: false,
      description:
        'The main image for the news article displayed on listing pages and article header',
    }),

    /* -------------------------------------------------------------- */
    /*  DESCRIPTION SECTION                                           */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'details',
      label: { en: 'Description', pt: 'Descrição' },
      admin: {
        description: 'Main description block of the article.',
      },
      fields: [
        {
          name: 'text',
          label: { en: 'Description Text', pt: 'Texto de Descrição' },
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Main paragraph describing the article',
            rows: 8,
          },
        },
        {
          name: 'sections',
          label: { en: 'Sections', pt: 'Secções' },
          type: 'array',
          interfaceName: 'NewsSection',
          admin: {
            description: 'Additional titled sections for the article body',
            initCollapsed: true,
            components: {
              RowLabel: '@/payload/collections/News/components/SectionsRowLabel',
            },
          },
          fields: [
            {
              name: 'title',
              label: { en: 'Section Title', pt: 'Título da Secção' },
              type: 'text',
              localized: true,
              admin: { description: 'e.g. "Background", "What happened", "Next steps"' },
            },
            {
              name: 'text',
              label: { en: 'Section Text', pt: 'Texto da Secção' },
              type: 'textarea',
              localized: true,
              admin: {
                description: 'Body text for this section',
                rows: 6,
              },
            },
          ],
        },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  PHOTO GALLERY                                                 */
    /* -------------------------------------------------------------- */
    MultiImageField({
      name: 'gallery',
      label: 'Galeria de Fotos',
      description: 'Photos displayed at the bottom of the article',
    }),

    /* -------------------------------------------------------------- */
    /*  RELATED PROJECT                                               */
    /* -------------------------------------------------------------- */
    {
      name: 'project',
      label: { en: 'Related Project', pt: 'Projeto Relacionado' },
      type: 'relationship',
      relationTo: 'hawk_projects',
      required: false,
      admin: {
        description:
          'Optionally link this news article to a project. The article will appear in the project page under "Related News".',
      },
    },
  ],
};

export default NewsDetails;
