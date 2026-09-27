import { Tab } from 'payload';
import { profileLinksField } from '../Artist/profileLinksField';

const CuratorFieldsTab: Tab = {
  label: { en: 'Curator Details', pt: 'Detalhes do Curador' },
  description: { en: 'Information about the curator', pt: 'Informação sobre o curador' },
  fields: [
    {
      type: 'text',
      name: 'name',
      label: { en: 'Curator Name', pt: 'Nome do Curador' },
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
    {
      type: 'text',
      name: 'role',
      label: { en: 'Role', pt: 'Função' },
      localized: true,
      admin: {
        description: {
          en: 'Shown under the name, e.g. "Visual Artist & Art Researcher".',
          pt: 'Aparece por baixo do nome, ex.: "Artista Plástica/Visual & Investigadora".',
        },
      },
    },
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
      on: 'curator',
      admin: {
        description: {
          en: 'Artworks curated by this curator. Add or change these from the artwork itself.',
          pt: 'Obras curadas por este curador. Adicione ou altere a partir da própria obra de arte.',
        },
        defaultColumns: ['title', 'year', 'is_sold'],
      },
    },
  ],
};
export default CuratorFieldsTab;
