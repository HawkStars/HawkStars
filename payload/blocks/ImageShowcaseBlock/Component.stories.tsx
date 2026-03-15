import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ImageShowcaseBlock } from './Component';

const meta: Meta<typeof ImageShowcaseBlock> = {
  title: 'Media/ImageShowcase',
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
      externalImage:
        'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Ocean view',
    },
  },
  {
    id: '3',
    image: {
      imageType: 'external' as const,
      externalImage:
        'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Forest path',
    },
  },
  {
    id: '4',
    image: {
      imageType: 'external' as const,
      externalImage:
        'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'City skyline',
    },
  },
  {
    id: '5',
    image: {
      imageType: 'external' as const,
      externalImage:
        'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
  {
    id: '7',
    image: {
      imageType: 'external' as const,
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
      alt: 'Mountain landscape',
    },
  },
  {
    id: '8',
    image: {
      imageType: 'external' as const,
      externalImage:
        'https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=908&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Ocean view',
    },
  },
  {
    id: '9',
    image: {
      imageType: 'external' as const,
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg',
      alt: 'Forest path',
    },
  },
  {
    id: '10',
    image: {
      imageType: 'external' as const,
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
      alt: 'City skyline',
    },
  },
  {
    id: '11',
    image: {
      imageType: 'external' as const,
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw8.jpeg',
      alt: 'Desert sunset',
    },
  },
  {
    id: '12',
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
    gridColumns: '1',
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
