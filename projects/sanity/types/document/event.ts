import { defineField, defineType } from 'sanity';
import { SEOFields, SEOFieldset, SEOGroup } from '../objects/seo';
import { CloudinaryAsset, InternationalizedArrayString } from '../../sanity.types';

export default defineType({
  name: 'hawkEvent',
  title: 'Event',
  type: 'document',
  groups: [SEOGroup],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'type_event',
      title: 'Type Event',
      type: 'string',
      options: {
        list: [
          { title: 'Erasmus +', value: 'erasmus' },
          { title: 'Local Event', value: 'local_event' },
          { title: 'International Event', value: 'international_event' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayFormattedText',
      description: 'More information for the event',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'cloudinary.asset' }],
    }),

    ...SEOFields,
  ],
  fieldsets: [SEOFieldset],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
    prepare(selection) {
      const { title, media } = selection;

      const ptTitle =
        title && (title as InternationalizedArrayString).find((item) => item._key == 'pt');
      const mediaFiles = media as CloudinaryAsset[];
      const mediaFile = mediaFiles?.[0] || undefined;

      return {
        title: ptTitle?.value || '',
        imageUrl: mediaFile?.secure_url,
      };
    },
  },
});
