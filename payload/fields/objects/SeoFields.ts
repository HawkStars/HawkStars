import {
  OverviewField,
  MetaTitleField,
  MetaImageField,
  MetaDescriptionField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';
import { Field, Tab } from 'payload';

export const SEOFields: Field = {
  name: 'seo',
  label: 'SEO Fields',
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
    PreviewField({
      // if the `generateUrl` function is configured
      hasGenerateFn: true,

      // field paths to match the target field for data
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
    }),
  ],
};

export const SEOTab: Tab = {
  name: 'seo',
  label: 'SEO',
  description: 'Search Engine Optimization fields For Search Engines',
  interfaceName: 'SEO',
  fields: [SEOFields],
};
