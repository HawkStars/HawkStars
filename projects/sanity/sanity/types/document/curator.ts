import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'curator',
  title: 'Curator',
  type: 'document',
  groups: [
    {
      name: 'text',
      title: 'Text',
    },
    {
      name: 'media',
      title: 'Media',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Where it is the curator located"
    }),
    defineField({
      name: 'description',
      title: 'Nota Biográfica',
      type: 'internationalizedArrayFormattedText',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'cloudinary.asset',
    }),
  ],
});
