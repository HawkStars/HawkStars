import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
} from '@payloadcms/plugin-seo/fields';
import { GroupField, Tab } from 'payload';

export const HawkProjectSEOFields: GroupField = {
  name: 'seo',
  label: 'Hawk Project SEO Fields',
  type: 'group',
  interfaceName: 'HawkProjectSeoFields',
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

export const HawkProjectSeoTab: Tab = {
  name: 'seo',
  label: 'SEO',
  description: 'Search Engine Optimization fields For Search Engines',
  interfaceName: 'SEO',
  fields: [HawkProjectSEOFields],
};
