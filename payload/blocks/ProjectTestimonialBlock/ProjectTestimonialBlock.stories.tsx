import type { Meta, StoryObj } from '@storybook/react';
import { ProjectTestimonialBlock } from './Component';

const meta: Meta<typeof ProjectTestimonialBlock> = {
  title: 'Testimonials/Project Testimonial',
  component: ProjectTestimonialBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['imageLeft', 'imageRight'],
    },
    backgroundColor: {
      control: 'select',
      options: ['none', 'light', 'dark', 'brand'],
    },
    blockType: {
      table: {
        disable: true,
      },
    },
    id: {
      table: {
        disable: true,
      },
    },
    blockName: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectTestimonialBlock>;

const createMediaObject = (id: string, url: string, alt: string) => ({
  id,
  alt,
  url,
  filename: `image-${id}.jpg`,
  mimeType: 'image/jpeg' as const,
  filesize: 300000,
  width: 800,
  height: 600,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const Default: Story = {
  args: {
    title: 'What Our Community Says',
    subtitle: 'Hear from the people who make our mission possible',
    author: {
      profileImage: createMediaObject(
        'author-1',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
        'John Smith'
      ),
      name: 'John Smith',
      role: 'Project Coordinator',
      organization: 'HawkStars Foundation',
    },
    testimonial:
      "Working with this organization has been transformative. The dedication of the team and the impact we've had on local communities is beyond what I ever imagined possible. Every day, I see the real difference our work makes.",
    projectMedia: {
      displayMode: 'single',
      images: [
        {
          id: 'img-1',
          image: createMediaObject(
            'project-1',
            'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&crop=center',
            'Team working together'
          ),
          caption: 'Our team during the 2024 community project',
        },
      ],
      autoplay: true,
      autoplayInterval: 4000,
    },
    layout: 'imageRight',
    backgroundColor: 'none',
    id: '1',
    blockName: 'ProjectTestimonial',
    blockType: 'projectTestimonialBlock',
  },
};

export const ImageLeft: Story = {
  args: {
    ...Default.args,
    layout: 'imageLeft',
  },
};

export const LightBackground: Story = {
  args: {
    ...Default.args,
    backgroundColor: 'light',
  },
};

export const DarkBackground: Story = {
  args: {
    ...Default.args,
    backgroundColor: 'dark',
  },
};

export const BrandBackground: Story = {
  args: {
    ...Default.args,
    backgroundColor: 'brand',
  },
};

export const WithSlideshow: Story = {
  args: {
    title: 'Impact Stories',
    subtitle: 'Real experiences from our volunteers and partners',
    author: {
      profileImage: createMediaObject(
        'author-2',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
        'Maria Santos'
      ),
      name: 'Maria Santos',
      role: 'Volunteer Leader',
      organization: 'Community Partners',
    },
    testimonial:
      'The slideshow behind me shows just a fraction of what we accomplished together. From building homes to creating educational opportunities, every image represents lives changed forever.',
    projectMedia: {
      displayMode: 'slideshow',
      images: [
        {
          id: 'img-1',
          image: createMediaObject(
            'project-1',
            'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&crop=center',
            'Community gathering'
          ),
          caption: 'Community gathering - Day 1',
        },
        {
          id: 'img-2',
          image: createMediaObject(
            'project-2',
            'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop&crop=center',
            'Volunteers at work'
          ),
          caption: 'Our volunteers making progress',
        },
        {
          id: 'img-3',
          image: createMediaObject(
            'project-3',
            'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop&crop=center',
            'Project completion'
          ),
          caption: 'The completed project celebration',
        },
      ],
      autoplay: true,
      autoplayInterval: 4000,
    },
    layout: 'imageRight',
    backgroundColor: 'none',
    id: '2',
    blockName: 'ProjectTestimonial',
    blockType: 'projectTestimonialBlock',
  },
};

export const SlideshowLeftNoAutoplay: Story = {
  args: {
    ...WithSlideshow.args,
    layout: 'imageLeft',
    projectMedia: {
      images: WithSlideshow?.args?.projectMedia?.images || [],
      autoplay: false,
      displayMode: 'slideshow',
    },
    id: '3',
  },
};

export const NoTitle: Story = {
  args: {
    author: {
      profileImage: createMediaObject(
        'author-3',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
        'Carlos Mendes'
      ),
      name: 'Carlos Mendes',
      role: 'Executive Director',
      organization: 'Global Initiative',
    },
    testimonial:
      'This testimonial block has no title or subtitle, focusing entirely on the quote and the project visuals. Sometimes simplicity is more powerful.',
    projectMedia: {
      displayMode: 'single',
      images: [
        {
          id: 'img-1',
          image: createMediaObject(
            'project-1',
            'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&h=600&fit=crop&crop=center',
            'Team success'
          ),
        },
      ],
      autoplay: true,
      autoplayInterval: 4000,
    },
    layout: 'imageRight',
    backgroundColor: 'light',
    id: '4',
    blockName: 'ProjectTestimonial',
    blockType: 'projectTestimonialBlock',
  },
};

export const MinimalAuthor: Story = {
  args: {
    title: 'Voices from the Field',
    author: {
      profileImage: createMediaObject(
        'author-4',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
        'Anonymous Volunteer'
      ),
      name: 'Anonymous Volunteer',
    },
    testimonial:
      'This example shows a testimonial with minimal author information - just a name and photo, no role or organization.',
    projectMedia: {
      displayMode: 'single',
      images: [
        {
          id: 'img-1',
          image: createMediaObject(
            'project-1',
            'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop&crop=center',
            'Group photo'
          ),
          caption: 'Making memories together',
        },
      ],
      autoplay: true,
      autoplayInterval: 4000,
    },
    layout: 'imageLeft',
    backgroundColor: 'none',
    id: '5',
    blockName: 'ProjectTestimonial',
    blockType: 'projectTestimonialBlock',
  },
};

export const LongTestimonial: Story = {
  args: {
    title: 'A Transformative Experience',
    author: {
      profileImage: createMediaObject(
        'author-5',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces',
        'Ana Costa'
      ),
      name: 'Ana Costa',
      role: 'Community Organizer',
      organization: 'Local Development Council',
    },
    testimonial:
      'When I first joined this initiative, I had no idea how much it would change my perspective on community development. Over the past three years, I have witnessed incredible transformations - not just in our neighborhoods, but in the people themselves. The families we have worked with have become empowered to take charge of their own futures. The children we have educated are now teaching others. The seeds we planted together are growing into forests of opportunity. This is what true, sustainable change looks like.',
    projectMedia: {
      displayMode: 'slideshow',
      images: [
        {
          id: 'img-1',
          image: createMediaObject(
            'project-1',
            'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&crop=center',
            'Community project'
          ),
        },
        {
          id: 'img-2',
          image: createMediaObject(
            'project-2',
            'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop&crop=center',
            'Education session'
          ),
        },
      ],
      autoplay: true,
      autoplayInterval: 5000,
    },
    layout: 'imageRight',
    backgroundColor: 'brand',
    id: '6',
    blockName: 'ProjectTestimonial',
    blockType: 'projectTestimonialBlock',
  },
};

export const MultipleSlideshowImages: Story = {
  args: {
    title: 'Project Highlights',
    subtitle: 'A visual journey through our latest initiative',
    author: {
      profileImage: createMediaObject(
        'author-6',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces',
        'Miguel Oliveira'
      ),
      name: 'Miguel Oliveira',
      role: 'Field Operations Manager',
      organization: 'HawkStars International',
    },
    testimonial:
      'Each image in this slideshow represents months of hard work, collaboration, and dedication from our entire team.',
    projectMedia: {
      displayMode: 'slideshow',
      images: [
        {
          id: 'img-1',
          image: createMediaObject(
            'project-1',
            'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&crop=center',
            'Phase 1'
          ),
          caption: 'Phase 1: Community Engagement',
        },
        {
          id: 'img-2',
          image: createMediaObject(
            'project-2',
            'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop&crop=center',
            'Phase 2'
          ),
          caption: 'Phase 2: Construction Begins',
        },
        {
          id: 'img-3',
          image: createMediaObject(
            'project-3',
            'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop&crop=center',
            'Phase 3'
          ),
          caption: 'Phase 3: Training Programs',
        },
        {
          id: 'img-4',
          image: createMediaObject(
            'project-4',
            'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop&crop=center',
            'Phase 4'
          ),
          caption: 'Phase 4: Community Celebration',
        },
        {
          id: 'img-5',
          image: createMediaObject(
            'project-5',
            'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop&crop=center',
            'Phase 5'
          ),
          caption: 'Phase 5: Long-term Impact',
        },
      ],
      autoplay: true,
      autoplayInterval: 3000,
    },
    layout: 'imageLeft',
    backgroundColor: 'light',
    id: '7',
    blockName: 'ProjectTestimonial',
    blockType: 'projectTestimonialBlock',
  },
};
