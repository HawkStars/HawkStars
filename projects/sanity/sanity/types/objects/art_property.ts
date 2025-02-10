import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'art_property',
  title: 'Art Property',
  type: 'object',
  description:
    'Information of the characteristics of the artwork. Both title and value needs to be on its associated language',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Title of the art property',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'value',
      title: 'Value',
      description: 'Value of the art property',
      type: 'internationalizedArrayString',
    }),
  ],
});
