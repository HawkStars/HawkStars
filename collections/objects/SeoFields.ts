import { Field } from 'payload';

export const SEOFields: Field = {
  name: 'seo',
  label: 'SEO Fields',
  type: 'group',
  fields: [
    { name: 'google_title', label: 'Title for Google', type: 'text', localized: true },
    {
      name: 'google_description',
      label: 'Description for Google',
      type: 'text',
      required: true,
      localized: true,
      validate: (data: string | undefined | null) =>
        data && data.length <= 255 ? true : 'Description should be a maximum of 255 characters',
    },
    {
      name: 'google_keywords',
      label: 'Keywords for Google',
      type: 'text',
      localized: true,
    },
  ],
};
