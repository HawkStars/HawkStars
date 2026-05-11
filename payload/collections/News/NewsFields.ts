import { PayloadImageField } from '@/payload/fields/ImageType';
import { MultiImageField } from '@/payload/fields/MultiImage';
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
    PayloadImageField({
      label: 'Cover Image',
      name: 'mainImage',
      required: false,
      description:
        'The main image for the news article displayed on listing pages and article header',
    }),

    /* -------------------------------------------------------------- */
    /*  DESCRIPTION SECTION                                           */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'details',
      label: 'Description',
      admin: {
        description: 'Main description block of the article.',
      },
      fields: [
        {
          name: 'text',
          label: 'Description Text',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Main paragraph describing the article',
            rows: 8,
          },
        },
        {
          name: 'sections',
          label: 'Sections',
          type: 'array',
          interfaceName: 'NewsSection',
          admin: {
            description: 'Additional titled sections for the article body',
            initCollapsed: true,
            components: {
              RowLabel: '@/payload/collections/News/components/SectionsRowLabel',
            },
          },
          fields: [
            {
              name: 'title',
              label: 'Section Title',
              type: 'text',
              localized: true,
              admin: { description: 'e.g. "Background", "What happened", "Next steps"' },
            },
            {
              name: 'text',
              label: 'Section Text',
              type: 'textarea',
              localized: true,
              admin: {
                description: 'Body text for this section',
                rows: 6,
              },
            },
          ],
        },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  PHOTO GALLERY                                                 */
    /* -------------------------------------------------------------- */
    MultiImageField({
      name: 'gallery',
      label: 'Photo Gallery',
      description: 'Photos displayed at the bottom of the article',
    }),

    /* -------------------------------------------------------------- */
    /*  RELATED PROJECT                                               */
    /* -------------------------------------------------------------- */
    {
      name: 'project',
      label: 'Related Project',
      type: 'relationship',
      relationTo: 'hawk_projects',
      required: false,
      admin: {
        description:
          'Optionally link this news article to a project. The article will appear in the project page under "Related News".',
      },
    },
  ],
};

export default NewsDetails;
