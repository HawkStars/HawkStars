import MultiRowImage from './Component';
import { MultiRowImageBlock } from '@/payload-types';

const sampleRows: MultiRowImageBlock['rows'] = [
  {
    images: [
      {
        id: '1',
        image: {
          imageType: 'external',
          externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
          alt: 'Black and white photo of a mountain lake',
        },
        column_size: '4',
        row_size: '1',
      },
      {
        id: '2',
        image: {
          imageType: 'external',
          externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw8.jpeg',
          alt: 'Black and white photo of a mountain lake',
        },
        column_size: '2',
        row_size: '1',
      },
      {
        id: '3',
        image: {
          imageType: 'external',
          externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg',
          alt: 'Black and white photo of a mountain lake',
        },
        column_size: '6',
        row_size: '2',
      },
      {
        id: '4',
        image: {
          imageType: 'external',
          externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
          alt: 'Black and white photo of a mountain lake',
        },
        column_size: '6',
        row_size: '2',
      },
    ],
  },
];

const defaultComponent = {
  title: 'Media/MultiRow',
  component: MultiRowImage,
};

export default defaultComponent;

export const Default = () => (
  <MultiRowImage
    blockType='multiRowImage'
    rows={sampleRows}
    rowGap={24}
    columnGap={16}
    numberColumns={'12'}
  />
);

export const ThreeColumns = () => (
  <MultiRowImage
    blockType='multiRowImage'
    rows={[
      {
        images: [
          {
            id: '1',
            image: {
              imageType: 'external',
              externalImage:
                'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
              alt: 'Black and white photo of a mountain lake',
            },

            column_size: '4',
            row_size: '1',
          },
          {
            id: '2',
            image: {
              imageType: 'external',
              externalImage:
                'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw8.jpeg',
              alt: 'Black and white photo of a mountain lake',
            },
            column_size: '4',
            row_size: '1',
          },
          {
            id: '3',
            image: {
              imageType: 'external',
              externalImage:
                'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg',
              alt: 'Black and white photo of a mountain lake',
            },
            column_size: '4',
            row_size: '1',
          },
        ],
      },
    ]}
    rowGap={24}
    columnGap={16}
    numberColumns='12'
  />
);

export const MixedSizes = () => (
  <MultiRowImage
    blockType='multiRowImage'
    rows={[
      {
        images: [
          {
            id: '1',
            image: {
              imageType: 'external',
              externalImage:
                'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
              alt: 'Black and white photo of a mountain lake',
            },
            column_size: '3',
            row_size: '2',
          },
          {
            id: '2',
            image: {
              imageType: 'external',
              externalImage:
                'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw8.jpeg',
              alt: 'Black and white photo of a mountain lake',
            },
            column_size: '6',
            row_size: '1',
          },
          {
            id: '3',
            image: {
              imageType: 'external',
              externalImage:
                'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg',
              alt: 'Black and white photo of a mountain lake',
            },
            column_size: '3',
            row_size: '1',
          },
          {
            id: '4',
            image: {
              imageType: 'external',
              externalImage:
                'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
              alt: 'Black and white photo of a mountain lake',
            },
            column_size: '6',
            row_size: '1',
          },
        ],
      },
    ]}
    rowGap={32}
    columnGap={24}
    numberColumns={'12'}
  />
);
