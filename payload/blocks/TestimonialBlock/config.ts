import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const TestimonialBlock: Block = {
  slug: 'testimonialBlock',
  interfaceName: 'TestimonialBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional title for the testimonial section',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional subtitle or description',
      },
    },
    {
      name: 'testimonials',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          localized: true,
          admin: {
            description: 'The testimonial quote or review',
          },
        },
        {
          name: 'author',
          type: 'group',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'Author full name',
              },
            },
            {
              name: 'title',
              type: 'text',
              localized: true,
              admin: {
                description: 'Job title or role',
              },
            },
            {
              name: 'company',
              type: 'text',
              localized: true,
              admin: {
                description: 'Company or organization',
              },
            },
            PayloadImageField({
              label: 'Avatar',
              name: 'avatar',
              required: false,
              description: 'Author profile photo',
            }),
          ],
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            description: 'Star rating (1-5 stars)',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as featured testimonial (larger display)',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        {
          label: 'Single Column',
          value: 'single',
        },
        {
          label: 'Two Columns',
          value: 'two-cols',
        },
        {
          label: 'Three Columns',
          value: 'three-cols',
        },
        {
          label: 'Carousel',
          value: 'carousel',
        },
        {
          label: 'Masonry',
          value: 'masonry',
        },
      ],
      defaultValue: 'three-cols',
      admin: {
        description: 'How to display the testimonials',
      },
    },
    {
      name: 'style',
      type: 'select',
      options: [
        {
          label: 'Card Style',
          value: 'card',
        },
        {
          label: 'Quote Style',
          value: 'quote',
        },
        {
          label: 'Minimal',
          value: 'minimal',
        },
        {
          label: 'Bubble',
          value: 'bubble',
        },
      ],
      defaultValue: 'card',
      admin: {
        description: 'Visual style of testimonials',
      },
    },
    {
      name: 'showRatings',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display star ratings',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      options: [
        {
          label: 'None (transparent)',
          value: 'none',
        },
        {
          label: 'Light Gray',
          value: 'light-gray',
        },
        {
          label: 'Dark',
          value: 'dark',
        },
        {
          label: 'Brand Color',
          value: 'brand',
        },
      ],
      defaultValue: 'none',
    },
    SectionID,
  ],
  labels: {
    plural: 'Testimonial Blocks',
    singular: 'Testimonial Block',
  },
};
