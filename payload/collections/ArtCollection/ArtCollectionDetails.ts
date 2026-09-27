import type { Field } from 'payload';
import { ART_CATEGORIES } from './categories';
import { DIMENSION_TYPES } from '@/lib/art-gallery/dimensions';

/**
 * Every artwork field, in the order editors fill them in. Rendered flat (no
 * tabs) so the whole artwork can be edited on one page.
 */
const ArtCollectionFields: Field[] = [
  /* ---------------------------------------------------------------- */
  /*  IDENTIFICATION                                                  */
  /* ---------------------------------------------------------------- */
  {
    name: 'title',
    label: { en: 'Title', pt: 'Título' },
    type: 'text',
    localized: true,
    required: true,
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    unique: true,
    required: true,
    admin: {
      description: {
        en: 'Auto-filled from the title. Edit it yourself if you want a different URL.',
        pt: 'Preenchido automaticamente a partir do título. Edite se quiser um URL diferente.',
      },
    },
    hooks: {
      beforeChange: [
        ({ value, data }) => {
          if (value) return value;
          return data?.title?.replace(/\s+/g, '-').toLowerCase();
        },
      ],
    },
  },
  {
    name: 'reference',
    label: { en: 'Catalogue Reference', pt: 'Referência de Catálogo' },
    type: 'text',
    unique: true,
    admin: {
      description: {
        en: 'Generated automatically (e.g. GA-4K7Q2M) if left empty. Sent with purchases and questions about the artwork.',
        pt: 'Gerada automaticamente (ex.: GA-4K7Q2M) se ficar vazia. Acompanha as compras e dúvidas sobre a obra.',
      },
    },
    hooks: {
      beforeChange: [
        ({ value }) =>
          value ||
          `GA-${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 4)}`.toUpperCase(),
      ],
    },
  },
  {
    type: 'row',
    fields: [
      {
        name: 'artist',
        label: { en: 'Artist', pt: 'Artista' },
        type: 'relationship',
        required: true,
        relationTo: 'artists',
        hasMany: false,
        admin: {
          allowCreate: false,
          allowEdit: false,
          width: '50%',
          description: {
            en: 'The artist who created this artwork.',
            pt: 'O artista que criou esta obra.',
          },
        },
      },
      {
        name: 'curator',
        label: { en: 'Curator', pt: 'Curador' },
        type: 'relationship',
        required: false,
        relationTo: 'curators',
        hasMany: false,
        admin: {
          allowCreate: false,
          allowEdit: false,
          width: '50%',
          description: {
            en: 'The curator responsible for including this artwork in the collection.',
            pt: 'O curador responsável por incluir esta obra na coleção.',
          },
        },
      },
    ],
  },
  {
    name: 'category',
    label: { en: 'Category', pt: 'Categoria' },
    type: 'select',
    required: false,
    options: ART_CATEGORIES.map(({ value, label }) => ({ value, label })),
    admin: {
      description: {
        en: 'The options are fixed and must stay in this order — it is the order they are shown in on the site.',
        pt: 'As opções são fixas e devem manter-se nesta ordem — é a ordem em que aparecem no site.',
      },
    },
  },

  /* ---------------------------------------------------------------- */
  /*  IMAGES                                                          */
  /* ---------------------------------------------------------------- */
  {
    name: 'image',
    label: { en: 'Image', pt: 'Imagem' },
    type: 'upload',
    relationTo: 'media',
    required: true,
    localized: false,
  },
  {
    name: 'environment_images',
    label: { en: 'Artwork in Environments', pt: 'Obra em Ambientes' },
    type: 'upload',
    relationTo: 'media',
    hasMany: true,
    required: false,
    admin: {
      description: {
        en: 'Photos or mock-ups of the artwork in different spaces (living room, office, gallery wall…). Shown as extra views in the artwork viewer.',
        pt: 'Fotografias ou simulações da obra em diferentes espaços (sala, escritório, parede de galeria…). Aparecem como vistas extra no visualizador da obra.',
      },
    },
  },

  /* ---------------------------------------------------------------- */
  /*  TECHNICAL SHEET                                                 */
  /* ---------------------------------------------------------------- */
  {
    type: 'row',
    fields: [
      {
        name: 'year',
        label: { en: 'Year', pt: 'Ano' },
        type: 'number',
        localized: false,
        admin: { width: '25%' },
      },
      {
        name: 'technique',
        label: { en: 'Technique & Support', pt: 'Técnica & Suporte' },
        type: 'text',
        localized: true,
        required: false,
        admin: {
          width: '75%',
          description: {
            en: 'E.g. "Oil and mineral pigments on Belgian linen".',
            pt: 'Ex.: "Óleo e pigmentos minerais sobre linho cru belga".',
          },
        },
      },
    ],
  },
  {
    name: 'dimension_type',
    label: { en: 'Dimensions', pt: 'Dimensões' },
    type: 'radio',
    required: true,
    defaultValue: 'unframed',
    options: DIMENSION_TYPES.map(({ value, label }) => ({ value, label })),
    admin: {
      layout: 'horizontal',
      description: {
        en: 'Unframed / framed: width and length. Dimensions: width, length and height (objects, sculptures…). Shown the same way on every artwork, e.g. "77 × 54,5 cm (sem moldura)".',
        pt: 'Sem / com moldura: largura e comprimento. Dimensão: largura, comprimento e altura (objetos, esculturas…). Aparece igual em todas as obras, ex.: "77 × 54,5 cm (sem moldura)".',
      },
    },
  },
  {
    type: 'row',
    fields: [
      {
        name: 'width_cm',
        label: { en: 'Width (cm)', pt: 'Largura (cm)' },
        type: 'number',
        min: 0,
        admin: { width: '33%', step: 0.1 },
      },
      {
        name: 'length_cm',
        label: { en: 'Length (cm)', pt: 'Comprimento (cm)' },
        type: 'number',
        min: 0,
        admin: { width: '33%', step: 0.1 },
      },
      {
        name: 'height_cm',
        label: { en: 'Height (cm)', pt: 'Altura (cm)' },
        type: 'number',
        min: 0,
        admin: {
          width: '33%',
          step: 0.1,
          condition: (_, siblingData) => siblingData?.dimension_type === 'object',
        },
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /*  SALE & EDITIONS                                                 */
  /* ---------------------------------------------------------------- */
  {
    type: 'row',
    fields: [
      {
        name: 'price_value',
        label: { en: 'Price (€, excl. VAT)', pt: 'Preço (€, sem IVA)' },
        type: 'number',
        min: 0,
        required: false,
        admin: {
          width: '34%',
          description: {
            en: 'Base price in euros, without VAT. Without it the artwork shows "Price on request" and cannot be bought online.',
            pt: 'Preço base em euros, sem IVA. Sem ele a obra mostra "Preço sob consulta" e não pode ser comprada online.',
          },
        },
      },
      {
        name: 'edition_size',
        label: { en: 'Edition Size', pt: 'Tiragem' },
        type: 'number',
        min: 1,
        required: true,
        defaultValue: 1,
        admin: {
          width: '33%',
          description: {
            en: 'Total number of copies. 1 = unique piece.',
            pt: 'Número total de exemplares. 1 = peça única.',
          },
        },
      },
      {
        name: 'available_quantity',
        label: { en: 'Copies Remaining', pt: 'Tiragens Restantes' },
        type: 'number',
        min: 0,
        admin: {
          width: '33%',
          description: {
            en: 'Goes down by one each time an online sale is confirmed. Starts equal to the edition size; adjust it by hand for sales made outside the site.',
            pt: 'Desce um exemplar sempre que uma venda online é confirmada. Começa igual à tiragem; ajuste à mão para vendas feitas fora do site.',
          },
        },
      },
    ],
  },
  {
    name: 'tiragem',
    label: { en: 'Edition Notes', pt: 'Notas da Tiragem' },
    type: 'text',
    localized: true,
    required: false,
    admin: {
      description: {
        en: 'Optional, e.g. "signed, numbered and certified by the artist".',
        pt: 'Opcional, ex.: "assinados, numerados e certificados pela artista".',
      },
    },
  },
  {
    name: 'is_sold',
    label: { en: 'Sold Out', pt: 'Esgotada' },
    type: 'checkbox',
    localized: false,
    admin: {
      readOnly: true,
      description: {
        en: 'Automatic: ticked when no copies remain.',
        pt: 'Automático: fica marcado quando não restam exemplares.',
      },
    },
  },
  {
    name: 'featured',
    label: {
      en: 'Featured on the Gallery Home Page',
      pt: 'Destaque na Página Principal da Galeria',
    },
    type: 'checkbox',
    defaultValue: false,
    admin: {
      description: {
        en: 'Featured artworks rotate in the hero of the gallery home page.',
        pt: 'As obras em destaque rodam no topo da página principal da galeria.',
      },
    },
  },

  /* ---------------------------------------------------------------- */
  /*  TEXTS                                                           */
  /* ---------------------------------------------------------------- */
  {
    name: 'synopsis',
    label: { en: 'Synopsis', pt: 'Sinopse' },
    type: 'richText',
    required: true,
    localized: true,
  },
  {
    name: 'extra',
    label: { en: 'Extra Information', pt: 'Informação Extra' },
    type: 'richText',
    required: false,
    localized: true,
  },
  {
    name: 'critical_note',
    label: { en: 'Critical Note', pt: 'Nota Crítica' },
    type: 'group',
    admin: {
      description: {
        en: 'Optional quote about the artwork, shown as "Aesthetic & Theoretical Analysis".',
        pt: 'Citação opcional sobre a obra, mostrada como "Análise Estética & Teórica".',
      },
    },
    fields: [
      {
        name: 'quote',
        label: { en: 'Quote', pt: 'Citação' },
        type: 'textarea',
        localized: true,
      },
      {
        name: 'author',
        label: { en: 'Author', pt: 'Autor' },
        type: 'text',
        localized: true,
      },
    ],
  },
];

export default ArtCollectionFields;
