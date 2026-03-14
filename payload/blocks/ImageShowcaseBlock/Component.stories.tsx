import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ImageShowcaseBlock } from './Component';

const meta: Meta<typeof ImageShowcaseBlock> = {
  title: 'Blocks/ImageShowcase',
  component: ImageShowcaseBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ImageShowcaseBlock>;

const sampleImages = [
  {
    id: '1',
    image: {
      imageType: 'external' as const,
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
      alt: 'Mountain landscape',
    },
  },
  {
    id: '2',
    image: {
      imageType: 'external' as const,
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw8.jpeg',
      alt: 'Ocean view',
    },
  },
  {
    id: '3',
    image: {
      imageType: 'external' as const,
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg',
      alt: 'Forest path',
    },
  },
  {
    id: '4',
    image: {
      imageType: 'external' as const,
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
      alt: 'City skyline',
    },
  },
  {
    id: '5',
    image: {
      imageType: 'external' as const,
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw8.jpeg',
      alt: 'Desert sunset',
    },
  },
  {
    id: '6',
    image: {
      imageType: 'external' as const,
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg',
      alt: 'Snowy peaks',
    },
  },
];

export const Default: Story = {
  args: {
    blockType: 'imageShowcase',
    images: sampleImages,
    transitionDuration: 5000,
  },
};

export const FastTransition: Story = {
  args: {
    blockType: 'imageShowcase',
    images: sampleImages,
    transitionDuration: 2000,
  },
};

export const SlowTransition: Story = {
  args: {
    blockType: 'imageShowcase',
    images: sampleImages,
    transitionDuration: 10000,
  },
};

export const TwoImages: Story = {
  args: {
    blockType: 'imageShowcase',
    images: sampleImages.slice(0, 2),
    transitionDuration: 5000,
  },
};

export const FourImages: Story = {
  args: {
    blockType: 'imageShowcase',
    images: sampleImages.slice(0, 4),
    transitionDuration: 5000,
  },
};
