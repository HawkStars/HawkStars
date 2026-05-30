import { Tab } from 'payload';

const ArtCollectionDetails: Tab = {
  label: { en: 'Details', pt: 'Detalhes' },
  description: 'Information about the artwork',
  fields: [
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
      hooks: {
        beforeChange: [
          ({ data }) => {
            data?.title?.replace(/\s+/g, '-').toLowerCase();
          },
        ],
      },
    },
    {
      name: 'artist',
      label: { en: 'Artist', pt: 'Artista' },
      type: 'relationship',
      required: true,
      relationTo: 'curators',
      hasMany: false,
      admin: {
        allowCreate: false,
        allowEdit: false,
      },
    },
    {
      name: 'synopsis',
      label: { en: 'Synopsis', pt: 'Sinopse' },
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'image',
      label: { en: 'Image', pt: 'Imagem' },
      type: 'upload',
      relationTo: 'media',
      required: true,
      localized: false,
    },
    {
      name: 'is_sold',
      label: { en: 'Sold?', pt: 'Vendido?' },
      type: 'checkbox',
      localized: false,
    },
    {
      name: 'year',
      label: { en: 'Year', pt: 'Ano' },
      type: 'number',
      localized: false,
    },
    {
      name: 'price',
      label: { en: 'Price', pt: 'Preço' },
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'settings',
      label: { en: 'Photo Settings', pt: 'Definições da Fotografia' },
      type: 'text',
      localized: true,
      required: false,
    },
    {
      name: 'tiragem',
      label: { en: 'Print Run', pt: 'Tiragem' },
      type: 'text',
      localized: true,
      required: false,
    },
    {
      name: 'dimensions',
      label: { en: 'Dimensions', pt: 'Dimensões' },
      type: 'text',
      localized: true,
      required: false,
    },
    {
      name: 'extra',
      label: { en: 'Extra Information', pt: 'Informação Extra' },
      type: 'richText',
      required: false,
      localized: true,
    },
  ],
};

export default ArtCollectionDetails;
