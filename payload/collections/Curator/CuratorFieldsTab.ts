import { Tab } from 'payload';

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
  ],
};
export default CuratorFieldsTab;
