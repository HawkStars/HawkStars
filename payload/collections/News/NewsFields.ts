import { PayloadImageField } from '@/payload/fields/ImageType';
import { MultiImageField } from '@/payload/fields/MultiImage';
import { Tab } from 'payload';

const NewsDetails: Tab = {
  label: { en: 'Details', pt: 'Detalhes' },
  description: {
    en: 'Information about the News article',
    pt: 'Informação sobre o artigo de notícias',
  },
  admin: {
    description: {
      en: 'Configure the details for the News article here',
      pt: 'Configure aqui os detalhes do artigo de notícias',
    },
  },
  fields: [
    {
      name: 'title',
      label: { en: 'Title', pt: 'Título' },
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: { en: 'The title of the news article', pt: 'O título do artigo de notícias' },
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
        description: { en: 'The type of the news article', pt: 'O tipo do artigo de notícias' },
      },
    },
    PayloadImageField({
      label: 'Imagem de Capa',
      name: 'mainImage',
      required: false,
      description: {
        en: 'The main image for the news article displayed on listing pages and article header',
        pt: 'A imagem principal do artigo exibida nas páginas de listagem e no cabeçalho do artigo',
      },
    }),

    /* -------------------------------------------------------------- */
    /*  DESCRIPTION SECTION                                           */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'details',
      label: { en: 'Description', pt: 'Descrição' },
      admin: {
        description: {
          en: 'Main description block of the article.',
          pt: 'Bloco de descrição principal do artigo.',
        },
      },
      fields: [
        {
          name: 'text',
          label: { en: 'Description Text', pt: 'Texto de Descrição' },
          type: 'textarea',
          localized: true,
          admin: {
            description: {
              en: 'Main paragraph describing the article',
              pt: 'Parágrafo principal a descrever o artigo',
            },
            rows: 8,
          },
        },
        {
          name: 'sections',
          label: { en: 'Sections', pt: 'Secções' },
          type: 'array',
          interfaceName: 'NewsSection',
          admin: {
            description: {
              en: 'Additional titled sections for the article body',
              pt: 'Secções com título adicionais para o corpo do artigo',
            },
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
              admin: {
                description: {
                  en: 'e.g. "Background", "What happened", "Next steps"',
                  pt: 'ex: "Contexto", "O que aconteceu", "Próximos passos"',
                },
              },
            },
            {
              name: 'text',
              label: { en: 'Section Text', pt: 'Texto da Secção' },
              type: 'textarea',
              localized: true,
              admin: {
                description: {
                  en: 'Body text for this section',
                  pt: 'Texto do corpo desta secção',
                },
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
      description: {
        en: 'Photos displayed at the bottom of the article',
        pt: 'Fotos exibidas no fundo do artigo',
      },
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
        description: {
          en: 'Optionally link this news article to a project. The article will appear in the project page under "Related News".',
          pt: 'Opcionalmente ligue este artigo a um projeto. O artigo aparecerá na página do projeto em "Notícias Relacionadas".',
        },
      },
    },
  ],
};

export default NewsDetails;
