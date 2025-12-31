import BentoGridBlock from './Component';
import { BentoGridItem } from '@/payload-types';

const sampleItems: BentoGridItem = [
  {
    id: '1',
    title: 'Our Mission',
    description:
      'Discover how we are making a difference in our community through art and culture.',
    backgroundImage: {
      imageType: 'external',
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
      alt: 'Mission background',
    },
    overlayOpacity: '50',
    contentPosition: 'bottom-left',
    link: {
      type: 'custom',
      url: '/about',
      label: 'Learn More',
      newTab: false,
    },
    column_size: '4',
    row_size: '2',
  },
  {
    id: '2',
    title: 'Events',
    description: 'Join us for upcoming cultural events and exhibitions.',
    backgroundImage: {
      imageType: 'external',
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw8.jpeg',
      alt: 'Events background',
    },
    overlayOpacity: '50',
    contentPosition: 'bottom-left',
    link: {
      type: 'custom',
      url: '/events',
      label: 'View Events',
      newTab: false,
    },
    column_size: '2',
    row_size: '1',
  },
  {
    id: '3',
    title: 'Art Collection',
    description: 'Explore our curated collection of contemporary and traditional art pieces.',
    backgroundImage: {
      imageType: 'external',
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg',
      alt: 'Art collection background',
    },
    overlayOpacity: '75',
    contentPosition: 'center',
    link: {
      type: 'custom',
      url: '/art',
      label: 'Browse Collection',
      newTab: false,
    },
    column_size: '2',
    row_size: '1',
  },
  {
    id: '4',
    title: 'Support Us',
    description: 'Help us continue our mission by contributing to our cause.',
    backgroundImage: {
      imageType: 'external',
      externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
      alt: 'Support background',
    },
    overlayOpacity: '50',
    contentPosition: 'bottom-right',
    link: {
      type: 'custom',
      url: '/contribute',
      label: 'Donate Now',
      newTab: false,
    },
    column_size: '2',
    row_size: '2',
  },
];

const defaultComponent = {
  title: 'Blocks/BentoGrid',
  component: BentoGridBlock,
};

export default defaultComponent;

export const Default = () => (
  <BentoGridBlock
    blockType='bentoGrid'
    items={sampleItems}
    rowGap={24}
    columnGap={16}
    numberColumns='6'
    minRowHeight={200}
  />
);

export const WithSectionTitle = () => (
  <BentoGridBlock
    blockType='bentoGrid'
    sectionTitle='Explore Our World'
    sectionDescription='Discover the different aspects of our cultural organization and find ways to get involved.'
    items={sampleItems}
    rowGap={24}
    columnGap={16}
    numberColumns='6'
    minRowHeight={200}
  />
);

export const ThreeColumnGrid = () => (
  <BentoGridBlock
    blockType='bentoGrid'
    sectionTitle='Our Programs'
    items={[
      {
        id: '1',
        title: 'Education',
        description: 'Learn about art history and techniques through our workshops.',
        backgroundImage: {
          imageType: 'external',
          externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
          alt: 'Education background',
        },
        overlayOpacity: '50',
        contentPosition: 'bottom-left',
        link: {
          type: 'custom',
          url: '/education',
          label: 'Explore Programs',
          newTab: false,
        },
        column_size: '4',
        row_size: '1',
      },
      {
        id: '2',
        title: 'Community',
        description: 'Connect with fellow art enthusiasts and creators.',
        backgroundImage: {
          imageType: 'external',
          externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw8.jpeg',
          alt: 'Community background',
        },
        overlayOpacity: '50',
        contentPosition: 'bottom-left',
        link: {
          type: 'custom',
          url: '/community',
          label: 'Join Us',
          newTab: false,
        },
        column_size: '4',
        row_size: '1',
      },
      {
        id: '3',
        title: 'Exhibitions',
        description: 'Visit our rotating exhibitions featuring local and international artists.',
        backgroundImage: {
          imageType: 'external',
          externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg',
          alt: 'Exhibitions background',
        },
        overlayOpacity: '50',
        contentPosition: 'bottom-left',
        link: {
          type: 'custom',
          url: '/exhibitions',
          label: 'See Exhibitions',
          newTab: false,
        },
        column_size: '4',
        row_size: '1',
      },
    ]}
    rowGap={24}
    columnGap={16}
    numberColumns='12'
    minRowHeight={250}
  />
);

export const NoBackgroundImages = () => (
  <BentoGridBlock
    blockType='bentoGrid'
    sectionTitle='Quick Links'
    items={[
      {
        id: '1',
        title: 'About Us',
        description: 'Learn about our history and mission.',
        overlayOpacity: '0',
        contentPosition: 'top-left',
        link: {
          type: 'custom',
          url: '/about',
          label: 'Read More',
          newTab: false,
        },
        column_size: '3',
        row_size: '1',
      },
      {
        id: '2',
        title: 'Contact',
        description: 'Get in touch with our team.',
        overlayOpacity: '0',
        contentPosition: 'top-left',
        link: {
          type: 'custom',
          url: '/contact',
          label: 'Contact Us',
          newTab: false,
        },
        column_size: '3',
        row_size: '1',
      },
      {
        id: '3',
        title: 'FAQ',
        description: 'Find answers to common questions.',
        overlayOpacity: '0',
        contentPosition: 'top-left',
        link: {
          type: 'custom',
          url: '/faq',
          label: 'View FAQ',
          newTab: false,
        },
        column_size: '3',
        row_size: '1',
      },
      {
        id: '4',
        title: 'Newsletter',
        description: 'Stay updated with our latest news.',
        overlayOpacity: '0',
        contentPosition: 'top-left',
        link: {
          type: 'custom',
          url: '/newsletter',
          label: 'Subscribe',
          newTab: false,
        },
        column_size: '3',
        row_size: '1',
      },
    ]}
    rowGap={16}
    columnGap={16}
    numberColumns='12'
    minRowHeight={180}
  />
);

export const MixedLayout = () => (
  <BentoGridBlock
    blockType='bentoGrid'
    sectionTitle='Featured Sections'
    sectionDescription='Explore the highlights of what we offer'
    items={[
      {
        id: '1',
        title: 'Gallery Highlights',
        description: 'See our most popular artworks and recent acquisitions.',
        backgroundImage: {
          imageType: 'external',
          externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw13.jpeg',
          alt: 'Gallery background',
        },
        overlayOpacity: '50',
        contentPosition: 'bottom-left',
        link: {
          type: 'custom',
          url: '/gallery',
          label: 'View Gallery',
          newTab: false,
        },
        column_size: '6',
        row_size: '2',
      },
      {
        id: '2',
        title: 'Upcoming Events',
        description: 'Check out what is happening this month.',
        backgroundImage: {
          imageType: 'external',
          externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw8.jpeg',
          alt: 'Events background',
        },
        overlayOpacity: '75',
        contentPosition: 'center',
        link: {
          type: 'custom',
          url: '/events',
          label: 'See Schedule',
          newTab: false,
        },
        column_size: '3',
        row_size: '1',
      },
      {
        id: '3',
        title: 'Membership',
        description: 'Join our community of art lovers.',
        backgroundImage: {
          imageType: 'external',
          externalImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg',
          alt: 'Membership background',
        },
        overlayOpacity: '50',
        contentPosition: 'bottom-center',
        link: {
          type: 'custom',
          url: '/membership',
          label: 'Become a Member',
          newTab: false,
        },
        column_size: '3',
        row_size: '1',
      },
      {
        id: '4',
        title: 'Shop',
        description: 'Browse our collection of art prints and merchandise.',
        overlayOpacity: '0',
        contentPosition: 'top-left',
        link: {
          type: 'custom',
          url: '/shop',
          label: 'Shop Now',
          newTab: false,
        },
        column_size: '3',
        row_size: '1',
      },
      {
        id: '5',
        title: 'Blog',
        description: 'Read articles about art, culture, and our community.',
        overlayOpacity: '0',
        contentPosition: 'top-left',
        link: {
          type: 'custom',
          url: '/blog',
          label: 'Read Blog',
          newTab: false,
        },
        column_size: '3',
        row_size: '1',
      },
    ]}
    rowGap={20}
    columnGap={20}
    numberColumns='12'
    minRowHeight={200}
  />
);
