import { Field } from 'payload';

export const SEOFields: Field = {
  name: 'seo',
  label: 'SEO Fields',
  type: 'group',
  fields: [
    {
      name: 'google_title',
      label: 'Title for Google',
      type: 'text',
      required: true,
      localized: true,
      maxLength: 60,
    },
    {
      name: 'google_description',
      label: 'Description for Google',
      type: 'text',
      required: true,
      localized: true,
      minLength: 50,
      maxLength: 255,
    },
    {
      name: 'google_keywords',
      label: 'Keywords for Google',
      type: 'array',
      fields: [{ name: 'keyword', label: 'Keyword', type: 'text' }],
      localized: true,
    },
  ],
};
