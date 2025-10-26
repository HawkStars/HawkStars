import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
} from '@payloadcms/plugin-seo/fields';
import { GroupField, Tab } from 'payload';

export const CuratorSEOFields: GroupField = {
  name: 'seo',
  label: 'Curator SEO Fields',
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

export const CuratorTab: Tab = {
  name: 'seo',
  label: 'SEO',
  description: 'Search Engine Optimization fields For Search Engines',
  interfaceName: 'SEO',
  fields: [CuratorSEOFields],
};
