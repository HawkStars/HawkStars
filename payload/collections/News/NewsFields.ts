import { PayloadImageField } from '@/payload/fields/ImageType';
import { MultiImageField } from '@/payload/fields/MultiImage';
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import { Tab } from 'payload';
import { PLATFORM_OPTIONS } from '../HawkProject/config';

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
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              BlocksFeature({
                blocks: [],
                inlineBlocks: [],
              }),
            ],
          }),
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
      label: { en: 'Related Project / Events', pt: 'Projeto ou Evento Relacionado' },
      type: 'relationship',
      relationTo: ['hawk_projects', 'hawk_events'],
      required: false,
      admin: {
        description: {
          en: 'Optionally link this news article to a project. The article will appear in the project page under "Related News".',
          pt: 'Opcionalmente ligue este artigo a um projeto. O artigo aparecerá na página do projeto em "Notícias Relacionadas".',
        },
      },
    },
    {
      name: 'references',
      label: { en: 'External References', pt: 'Referências Externas' },
      type: 'array',
      admin: {
        description: {
          en: 'Optionally add references to other news articles or external links.',
          pt: 'Opcionalmente adicione referências a outros artigos de notícias ou links externos.',
        },
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          label: { en: 'Reference Title', pt: 'Título da Referência' },
          type: 'text',
          localized: false,
          admin: {
            description: {
              en: 'Title of the reference link',
              pt: 'Título do link de referência',
            },
          },
        },
        {
          name: 'platform',
          label: { en: 'Reference Type', pt: 'Tipo de Referência' },
          type: 'select',
          options: PLATFORM_OPTIONS,
          defaultValue: 'website',
          required: true,
          admin: {
            description: {
              en: 'Type of the reference link (website, social media, etc.)',
              pt: 'Tipo do link de referência (site, mídia social, etc.)',
            },
          },
        },
        {
          name: 'url',
          label: { en: 'Reference URL', pt: 'URL da Referência' },
          type: 'text',
          admin: {
            description: {
              en: 'URL of the reference link',
              pt: 'URL do link de referência',
            },
          },
        },
      ],
    },
  ],
};

export default NewsDetails;
