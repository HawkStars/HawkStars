import React from 'react';
import MultiRowImage, { MultiRowImageBlockProps } from './Component';

const sampleRows: MultiRowImageBlockProps['rows'] = [
  {
    images: [
      {
        image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
        alt: 'Image 1',
        className: 'col-span-2 h-82 rounded-[2.5rem]',
      },
      {
        image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw8.jpeg',
        alt: 'Image 2',
        className: 'col-span-3 h-82 rounded-[2.5rem]',
      },
    ],
  },
  {
    images: [
      {
        image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg',
        alt: 'Image 3',
        className: 'col-span-5 h-100 rounded-[2.5rem]',
      },
    ],
  },
];

export default {
  title: 'Blocks/MultiRowImage',
  component: MultiRowImage,
};

export const Default = () => <MultiRowImage rows={sampleRows} rowGap={24} imageGap={16} />;
