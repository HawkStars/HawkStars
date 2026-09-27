import { Tab } from 'payload';
import { profileLinksField } from './profileLinksField';

const ArtistFieldsTab: Tab = {
  label: { en: 'Artist Details', pt: 'Detalhes do Artista' },
  description: { en: 'Information about the artist', pt: 'Informação sobre o artista' },
  fields: [
    {
      type: 'text',
      name: 'name',
      label: { en: 'Artist Name', pt: 'Nome do Artista' },
      required: true,
      hooks: {
        afterChange: [
          ({ data }) => {
            return { slug: data?.name.replace(/\s+/g, '-').toLowerCase() || ' ' };
          },
        ],
      },
    },
    {
      type: 'text',
      name: 'slug',
      label: 'Slug',
      unique: true,
      required: true,
    },
    { type: 'text', name: 'location', label: { en: 'Location', pt: 'Localização' } },
    {
      type: 'richText',
      name: 'description',
      label: { en: 'Biographical Note', pt: 'Nota Biográfica' },
      localized: true,
    },
    {
      type: 'upload',
      name: 'image',
      label: { en: 'Image', pt: 'Imagem' },
      relationTo: 'media',
      required: true,
    },
    profileLinksField,
    {
      type: 'join',
      name: 'artworks',
      label: { en: 'Associated Artworks', pt: 'Obras Associadas' },
      collection: 'artworks',
      on: 'artist',
      admin: {
        description: {
          en: 'Artworks by this artist. Add or change these from the artwork itself.',
          pt: 'Obras deste artista. Adicione ou altere a partir da própria obra de arte.',
        },
        defaultColumns: ['title', 'year', 'is_sold'],
      },
    },
  ],
};
export default ArtistFieldsTab;
