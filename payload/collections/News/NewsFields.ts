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
      name: 'lead',
      label: { en: 'Lead', pt: 'Lead / Subtítulo' },
      type: 'textarea',
      localized: true,
      admin: {
        description: {
          en: 'Optional one- or two-sentence introduction shown under the title (Art Gallery article view).',
          pt: 'Introdução opcional de uma ou duas frases mostrada por baixo do título (leitura na Galeria de Arte).',
        },
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

    {
      name: 'mainImageCaption',
      label: { en: 'Cover Image Caption', pt: 'Legenda da Imagem de Capa' },
      type: 'text',
      localized: true,
      admin: {
        description: {
          en: 'Optional caption shown under the cover image in the Art Gallery article view.',
          pt: 'Legenda opcional mostrada por baixo da imagem de capa na leitura do artigo na Galeria de Arte.',
        },
      },
    },
    {
      name: 'mainImageCredit',
      label: { en: 'Cover Image Credit', pt: 'Crédito da Imagem de Capa' },
      type: 'text',
      localized: true,
      admin: {
        description: {
          en: 'E.g. "Documentary photography: Hawk Stars NGO archive • February 2025".',
          pt: 'Ex.: "Fotografia documental: Arquivo Hawk Stars NGO • Fevereiro 2025".',
        },
      },
    },

    {
      name: 'showCoverAtEnd',
      label: {
        en: 'Also show the cover image, uncropped, at the end of the article',
        pt: 'Usar a imagem de capa também como fotografia inteira no fim do artigo',
      },
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: {
          en: 'In the Art Gallery article view, the cover stays at the top and the whole photo (not cropped) is added after the text.',
          pt: 'Na leitura do artigo na Galeria de Arte, a capa mantém-se no topo e a fotografia inteira (sem cortes) é acrescentada depois do texto.',
        },
      },
    },

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
      label: { en: 'Related Project / Event', pt: 'Projeto ou Evento Relacionado' },
      type: 'relationship',
      relationTo: ['hawk_projects', 'hawk_events'],
      required: false,
      admin: {
        description: {
          en: 'Optionally link this news article to a project or event. The article will appear on that page under "Related News".',
          pt: 'Opcionalmente ligue este artigo a um projeto ou evento. O artigo aparecerá nessa página em "Notícias Relacionadas".',
        },
      },
    },

    /* -------------------------------------------------------------- */
    /*  ART GALLERY RELATIONS                                         */
    /* -------------------------------------------------------------- */
    {
      name: 'galleryRelations',
      label: { en: 'Related in the Art Gallery', pt: 'Relacionado na Galeria de Arte' },
      type: 'relationship',
      relationTo: ['artworks', 'artists', 'curators'],
      hasMany: true,
      required: false,
      admin: {
        description: {
          en: 'Optional. Artworks from the catalogue, artists or curators this article is about. The article appears in their "Related News", and they are listed at the end of the article in the gallery.',
          pt: 'Opcional. Obras do catálogo, artistas ou curadores de que o artigo fala. O artigo aparece nas "Notícias Relacionadas" deles, e eles aparecem listados no fim do artigo na galeria.',
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
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'title',
          label: { en: 'Reference Title', pt: 'Título da Referência' },
          type: 'text',
          localized: true,
          required: false,
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
