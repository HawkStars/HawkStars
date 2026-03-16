import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const ProjectTestimonialBlock: Block = {
  slug: 'projectTestimonialBlock',
  interfaceName: 'ProjectTestimonialBlock',
  admin: {
    group: 'Social Proof',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional section title',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional section subtitle',
      },
    },
    {
      name: 'author',
      type: 'group',
      label: 'Author',
      fields: [
        PayloadImageField({
          label: 'Profile Image',
          name: 'profileImage',
          required: true,
          description: 'Profile image of the person giving the testimonial',
        }),
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Author full name',
          },
        },
        {
          name: 'role',
          type: 'text',
          localized: true,
          admin: {
            description: 'Author role or position',
          },
        },
        {
          name: 'organization',
          type: 'text',
          admin: {
            description: 'Company or organization',
          },
        },
      ],
    },
    {
      name: 'testimonial',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'The testimonial quote or review text',
      },
    },
    {
      name: 'projectMedia',
      type: 'group',
      label: 'Project Media',
      admin: {
        description: 'Images showing the project group or related visuals',
      },
      fields: [
        {
          name: 'displayMode',
          type: 'select',
          options: [
            { label: 'Single Image', value: 'single' },
            { label: 'Slideshow', value: 'slideshow' },
          ],
          defaultValue: 'single',
          admin: {
            description: 'How to display project images',
          },
        },
        {
          name: 'images',
          type: 'array',
          minRows: 1,
          required: true,
          labels: {
            singular: 'Image',
            plural: 'Images',
          },
          fields: [
            PayloadImageField({
              label: 'Image',
              name: 'image',
              required: true,
              hideGutter: true,
            }),
          ],
        },
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Automatically cycle through images (slideshow mode only)',
            condition: (_, siblingData) => siblingData?.displayMode === 'slideshow',
          },
        },
        {
          name: 'autoplayInterval',
          type: 'number',
          min: 2000,
          max: 10000,
          defaultValue: 4000,
          admin: {
            description: 'Time between slides in milliseconds',
            condition: (_, siblingData) =>
              siblingData?.displayMode === 'slideshow' && siblingData?.autoplay === true,
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: 'Image Left', value: 'imageLeft' },
        { label: 'Image Right', value: 'imageRight' },
      ],
      defaultValue: 'imageRight',
      admin: {
        description: 'Position of the project images relative to the testimonial',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      options: [
        { label: 'None (transparent)', value: 'none' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Brand', value: 'brand' },
      ],
      defaultValue: 'none',
      admin: {
        description: 'Background color for the section',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Project Testimonial Blocks',
    singular: 'Project Testimonial Block',
  },
};
