import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'art',
  title: 'Art',
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
    { name: 'properties',
      title: 'Art Properties'
    }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      group: ['text'],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: ['text'],
      options: {
        source: 'name',
      },
      hidden: ({ document }) => !document?.name,
    }),
    defineField({
      name: 'synopsis',
      title: 'Synopsis',
      group: ['text'],
      type: 'internationalizedArrayFormattedText',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      group: ['media'],
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'is_sold',
      title: 'Vendido?',
      type: 'boolean',
      group: ["properties"]
    }),
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'string',
      group: ["properties"]
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: ["properties"]
    }),
    defineField({
      name: "price",
      title: 'Price',
      type: "internationalizedArrayString",
      group: ["properties"]
    }),
    defineField({
      name: "settings",
      title: "Photo Settings",
      type: "internationalizedArrayString",
      description: "Type of foto settings",
      group: ["properties"]
    }),
    defineField({
      name: "tiragem",
      title: "Tiragem",
      type: "internationalizedArrayString",
      group: ["properties"]
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "internationalizedArrayString",
      group: ["properties"]
    }),
    defineField({
      name: "extra",
      title: "Extra Information",
      type: "internationalizedArrayFormattedText",
      group: ["properties"]
    })
  ],
});
