import { PayloadImageField } from '@/payload/fields/ImageType';
import { Tab } from 'payload';

const NewsDetails: Tab = {
  label: 'Details',
  description: 'Information about the News article',
  admin: {
    description: 'Configure the details for the News article here',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'The title of the news article',
      },
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      defaultValue: 'blog',
      required: true,
      options: [
        { label: 'Blog', value: 'blog' },
        { label: 'News', value: 'news' },
        { label: 'Press Release', value: 'press_release' },
        { label: 'Announcement', value: 'announcement' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'The type of the news article',
      },
    },
    {
      name: 'content',
      label: 'Content',
      type: 'richText',
      required: true,
      localized: true,
      admin: {
        description: 'The main content of the news article',
      },
    },
    PayloadImageField({
      label: 'Main Image',
      name: 'mainImage',
      required: true,
      description: 'The main image for the news article displayed on listing pages and article page',
    }),
  ],
};

export default NewsDetails;
