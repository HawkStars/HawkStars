import { defineType } from 'sanity';

export default defineType({
  name: 'social_link',
  title: 'Social Link',
  type: 'object',
  fields: [
    {
      name: 'url',
      type: 'string',
      title: 'URL',
      validation: (rule) => rule.required(),
    },
    {
      name: 'type',
      type: 'string',
      title: 'Type of Website',
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: 'Facebook', value: 'facebook' },
          { title: 'Linkedin', value: 'linkedin' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Website', value: 'website' },
        ],
      },
    },
  ],
});
