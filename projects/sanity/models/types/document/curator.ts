import { InternationalizedArrayString } from '@/projects/sanity/sanity.types';
import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';

export default defineType({
  name: 'curator',
  title: 'Curator',
  type: 'document',
  icon: UserIcon,
  groups: [
    {
      name: 'text',
      title: 'Text',
    },
    {
      name: 'media',
      title: 'Media',
    },
    { name: 'seo', title: 'Search Optimizer' },
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
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where it is the curator located',
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
    defineField({
      name: 'google_description',
      title: 'Description for Google',
      description: 'Description to be shown to the google search. recommended 255 characters',
      type: 'internationalizedArrayString',
      group: 'seo',
      validation: (rule) =>
        rule.custom((blocks: InternationalizedArrayString) => {
          const blockWithMoreThanRecommended = blocks.filter(
            (block) => block.value && block.value?.length > 255
          );
          if (blockWithMoreThanRecommended.length > 0)
            return {
              message: 'Descriptions should be maximum of 255 characters',
            };
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title: title,
        imageUrl: media.secure_url,
      };
    },
  },
});
