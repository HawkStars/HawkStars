import type { Block } from 'payload';

export const GallerySlider: Block = {
  slug: 'gallerySlider',
  interfaceName: 'GallerySliderBlock',
  fields: [
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable automatic slide transition',
      },
    },
    {
      name: 'autoplayDelay',
      type: 'number',
      defaultValue: 3000,
      min: 1000,
      max: 10000,
      admin: {
        description: 'Delay between slides in milliseconds (1000-10000)',
        condition: (data) => data.autoplay === true,
      },
    },
  ],
  labels: {
    plural: 'Gallery Sliders',
    singular: 'Gallery Slider',
  },
};
