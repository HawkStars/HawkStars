import SimpleGallery, { SimpleGalleryBlockProps } from './Component';

const sampleImages: SimpleGalleryBlockProps['images'] = [
  {
    image:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/alex-tyson-2Fv_otxbGtg-unsplash.jpg',
    alt: 'Interior 1',
  },
  {
    image:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/jason-leung-6uoj7DL6BFk-unsplash.jpg',
    alt: 'Interior 2',
  },
  {
    image:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/jonathan-borba-UisC7KLAWjs-unsplash.jpg',
    alt: 'Interior 3',
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
  />
);

export { Default };

export default Gallery;
