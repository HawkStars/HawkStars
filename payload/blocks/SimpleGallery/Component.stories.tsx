import SimpleGallery from './Component';
import { SimpleGallery as SimpleGalleryProps } from '@/payload-types';

const sampleImages: SimpleGalleryProps['images'] = [
  {
    image: {
      externalImage:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/alex-tyson-2Fv_otxbGtg-unsplash.jpg',
      imageType: 'external',
      alt: 'Interior 1',
    },
  },
  {
    image: {
      externalImage:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/jason-leung-6uoj7DL6BFk-unsplash.jpg',
      imageType: 'external',
      alt: 'Interior 2',
    },
  },
  {
    image: {
      externalImage:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/jonathan-borba-UisC7KLAWjs-unsplash.jpg',
      imageType: 'external',
      alt: 'Interior 3',
    },
  },
];

const Gallery = {
  title: 'Media/Simple Gallery',
  component: SimpleGallery,
};

const Default = () => (
  <SimpleGallery
    title='Beautiful Interiors.'
    description={
      'Explore our curated collection of stunning interior designs.\nEach space tells a unique story through thoughtful design and attention to detail.'
    }
    images={sampleImages}
    blockType={'simpleGallery'}
  />
);

export { Default };

export default Gallery;
