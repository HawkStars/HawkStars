import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
} from '@payloadcms/plugin-seo/fields';
import { GroupField } from 'payload';

export const ArtistSEOFields: GroupField = {
  name: 'seo',
  label: 'Artist SEO Fields',
  type: 'group',
  interfaceName: 'SeoFields',
  fields: [
    OverviewField({
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
      imagePath: 'meta.image',
    }),
    MetaTitleField({
      hasGenerateFn: true,
    }),
    MetaImageField({
      relationTo: 'media',
    }),
    MetaDescriptionField({}),
  ],
};

// Rendered as a plain group (not a tab) so every field of the artist is on
// one page in the admin. Same `seo` name, so the stored data is unchanged.
export const ArtistSeoGroup: GroupField = {
  name: 'seo',
  label: 'SEO',
  type: 'group',
  interfaceName: 'SEO',
  admin: {
    description: {
      en: 'Search engine and social media title, image and description.',
      pt: 'Título, imagem e descrição para motores de busca e redes sociais.',
    },
  },
  fields: [ArtistSEOFields],
};
