import { getPayload, Payload } from 'payload';
import config from '../../../payload.config';

/**
 * Seed script to create a demonstration page with all available blocks
 *
 * Run with: pnpm seed:demo-page
 *
 * This creates a comprehensive page showcasing all blocks:
 * - Hero Block
 * - Text Block
 * - Stats Block
 * - Card Grid Block
 * - Accordion Block
 * - Testimonial Block
 * - Call to Action Block
 * - Content with Image Block
 * - Impact Block
 * - Project Block
 * - Gallery Slider Block
 * - Video Block
 * - Media Block
 * - Column Based Block
 */
export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seeding database...');

  try {
    // First, let's ensure we have some basic media items for demos
    const demoImage = await payload.findByID({
      collection: 'media',
      id: '6917d2fa0c298b72f75903bf',
    });

    console.log('🎨 Created demo media:', demoImage.id);

    // Create the comprehensive demo page
    const demoPage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Block Showcase - All Available Blocks Demo',
        slug: 'block-showcase',
        layout: {
          root: {
            type: 'root',
            children: [
              // Hero Block
              {
                type: 'block',
                version: 1,
                fields: {
                  blockType: 'hero',
                  blockName: 'Hero Section',
                  heading: 'Welcome to HawkStars Block Showcase',
                  subheading:
                    'This page demonstrates all available content blocks in action. Explore the power and flexibility of our content management system.',
                  backgroundImage: demoImage.id,
                  overlayOpacity: 60,
                  links: [
                    {
                      link: {
                        type: 'custom',
                        url: '#stats',
                        label: 'See Our Impact',
                        newTab: false,
                      },
                      appearance: 'default',
                    },
                    {
                      link: {
                        type: 'custom',
                        url: '#testimonials',
                        label: 'Read Testimonials',
                        newTab: false,
                      },
                      appearance: 'outline',
                    },
                  ],
                },
              },

              // Text Block - Introduction
              {
                type: 'block',
                version: 1,
                fields: {
                  blockType: 'textBlock',
                  blockName: 'Introduction Text',
                  content: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'heading',
                          tag: 'h2',
                          children: [{ type: 'text', text: 'About This Showcase' }],
                          version: 1,
                        },
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: 'This page serves as a comprehensive demonstration of all available content blocks in the HawkStars CMS. Each block is designed to be flexible, reusable, and easy to manage through the admin interface.',
                            },
                          ],
                          version: 1,
                        },
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: "Content editors can mix and match these blocks to create rich, engaging pages without needing technical knowledge. Below you'll find examples of each block type in action.",
                            },
                          ],
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                  },
                  textAlign: 'center',
                  maxWidth: 'large',
                },
              },

              // Stats Block
              {
                type: 'block',
                version: 1,
                fields: {
                  blockType: 'statsBlock',
                  blockName: 'Impact Statistics',
                  title: 'Our Impact in Numbers',
                  subtitle:
                    'These statistics showcase the real-world impact of our work and community involvement.',
                  stats: [
                    {
                      value: 1500,
                      label: 'Community Members',
                      suffix: '+',
                      icon: 'Users',
                      color: 'blue',
                      description: 'Active participants in our programs',
                    },
                    {
                      value: 50000,
                      label: 'Euros Raised',
                      prefix: '€',
                      icon: 'DollarSign',
                      color: 'green',
                      description: 'For community projects and initiatives',
                      highlight: true,
                    },
                    {
                      value: 25,
                      label: 'Countries Reached',
                      icon: 'Globe',
                      color: 'purple',
                      description: 'International community presence',
                    },
                    {
                      value: 100,
                      label: 'Success Rate',
                      suffix: '%',
                      icon: 'Target',
                      color: 'green',
                      description: 'Project completion rate',
                    },
                  ],
                  layout: 'cols-4',
                  style: 'cards',
                  animateNumbers: true,
                  backgroundColor: 'light-gray',
                  textAlign: 'center',
                },
              },

              // Card Grid Block
              {
                type: 'block',
                version: 1,
                fields: {
                  blockType: 'cardGridBlock',
                  blockName: 'Our Services',
                  title: 'What We Offer',
                  subtitle:
                    'Discover the various ways we support our community and create meaningful impact.',
                  cards: [
                    {
                      title: 'Global Village Project',
                      description: {
                        root: {
                          type: 'root',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  type: 'text',
                                  text: 'Building an international training center to foster cross-cultural collaboration and learning opportunities.',
                                },
                              ],
                              version: 1,
                            },
                          ],
                          direction: 'ltr',
                          format: '',
                          indent: 0,
                          version: 1,
                        },
                      },
                      icon: 'Globe',
                      color: 'blue',
                      links: [
                        {
                          link: {
                            type: 'custom',
                            url: '/village',
                            label: 'Learn More',
                            newTab: false,
                          },
                          appearance: 'default',
                        },
                      ],
                    },
                    {
                      title: 'Community Programs',
                      description: {
                        root: {
                          type: 'root',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  type: 'text',
                                  text: 'Engaging local communities through educational workshops, cultural events, and skill development programs.',
                                },
                              ],
                              version: 1,
                            },
                          ],
                          direction: 'ltr',
                          format: '',
                          indent: 0,
                          version: 1,
                        },
                      },
                      icon: 'Users',
                      color: 'green',
                    },
                    {
                      title: 'Art & Culture',
                      description: {
                        root: {
                          type: 'root',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  type: 'text',
                                  text: 'Showcasing local artists and preserving cultural heritage through our curated art collection and exhibitions.',
                                },
                              ],
                              version: 1,
                            },
                          ],
                          direction: 'ltr',
                          format: '',
                          indent: 0,
                          version: 1,
                        },
                      },
                      icon: 'Heart',
                      color: 'purple',
                      links: [
                        {
                          link: {
                            type: 'custom',
                            url: '/art',
                            label: 'View Gallery',
                            newTab: false,
                          },
                          appearance: 'outline',
                        },
                      ],
                    },
                  ],
                  layout: 'cols-3',
                  cardStyle: 'hover',
                  textAlign: 'center',
                },
              },

              // Accordion Block - FAQ Section
              {
                type: 'block',
                version: 1,
                fields: {
                  blockType: 'accordionBlock',
                  blockName: 'Frequently Asked Questions',
                  items: [
                    {
                      title: 'How can I get involved with HawkStars?',
                      content: {
                        root: {
                          type: 'root',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  type: 'text',
                                  text: 'There are many ways to get involved! You can become a member, volunteer for our programs, contribute to our projects, or simply participate in our community events. Visit our membership page to learn more about the different options available.',
                                },
                              ],
                              version: 1,
                            },
                          ],
                          direction: 'ltr',
                          format: '',
                          indent: 0,
                          version: 1,
                        },
                      },
                      defaultOpen: true,
                    },
                    {
                      title: 'What is the Global Village Project?',
                      content: {
                        root: {
                          type: 'root',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  type: 'text',
                                  text: 'The Global Village Project is our flagship initiative to create an international training center. This facility will serve as a hub for cultural exchange, education, and community development programs that bring people together from around the world.',
                                },
                              ],
                              version: 1,
                            },
                          ],
                          direction: 'ltr',
                          format: '',
                          indent: 0,
                          version: 1,
                        },
                      },
                      defaultOpen: false,
                    },
                    {
                      title: 'How are contributions used?',
                      content: {
                        root: {
                          type: 'root',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  type: 'text',
                                  text: 'All contributions go directly toward our community projects, including the Global Village construction, educational programs, and local community support initiatives. We maintain full transparency about fund usage through our public transparency page.',
                                },
                              ],
                              version: 1,
                            },
                          ],
                          direction: 'ltr',
                          format: '',
                          indent: 0,
                          version: 1,
                        },
                      },
                      defaultOpen: false,
                    },
                    {
                      title: 'Where are you located?',
                      content: {
                        root: {
                          type: 'root',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  type: 'text',
                                  text: 'HawkStars is based in Pinhel, Portugal, but our impact extends internationally. Our Global Village Project will serve as a central location for programs that reach communities across multiple countries and cultures.',
                                },
                              ],
                              version: 1,
                            },
                          ],
                          direction: 'ltr',
                          format: '',
                          indent: 0,
                          version: 1,
                        },
                      },
                      defaultOpen: false,
                    },
                  ],
                  allowMultipleOpen: false,
                  style: 'card',
                },
              },

              // Testimonial Block
              {
                type: 'block',
                version: 1,
                fields: {
                  blockType: 'testimonialBlock',
                  blockName: 'Community Testimonials',
                  title: 'What Our Community Says',
                  subtitle:
                    'Hear from the people whose lives have been touched by our programs and initiatives.',
                  testimonials: [
                    {
                      quote:
                        'HawkStars has transformed not just our local community, but created connections that span continents. The Global Village Project represents everything we hope to achieve in bringing cultures together.',
                      author: {
                        name: 'Maria Santos',
                        title: 'Community Leader',
                        company: 'Pinhel Cultural Association',
                      },
                      rating: 5,
                      featured: true,
                    },
                    {
                      quote:
                        'The educational programs offered by HawkStars have opened doors I never thought possible. The international perspective they bring is invaluable for our young people.',
                      author: {
                        name: 'João Pereira',
                        title: 'Local Educator',
                        company: 'Pinhel Secondary School',
                      },
                      rating: 5,
                      featured: false,
                    },
                    {
                      quote:
                        'As an artist, having my work featured in the HawkStars collection has given me exposure to a global audience. They truly understand the power of art to unite people.',
                      author: {
                        name: 'Ana Rodriguez',
                        title: 'Visual Artist',
                        company: 'Independent',
                      },
                      rating: 5,
                      featured: false,
                    },
                  ],
                  layout: 'three-cols',
                  style: 'card',
                  showRatings: true,
                  backgroundColor: 'none',
                },
              },

              // Call to Action Block
              {
                type: 'block',
                version: 1,
                fields: {
                  blockType: 'cta',
                  blockName: 'Join Our Mission',
                  richText: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'heading',
                          tag: 'h2',
                          children: [{ type: 'text', text: 'Ready to Make a Difference?' }],
                          version: 1,
                        },
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: 'Join thousands of community members who are already part of our mission to create positive change. Whether through membership, volunteering, or contributions, every action matters.',
                            },
                          ],
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                  },
                  links: [
                    {
                      link: {
                        type: 'custom',
                        url: '/member',
                        label: 'Become a Member',
                        newTab: false,
                      },
                      appearance: 'default',
                    },
                    {
                      link: {
                        type: 'custom',
                        url: '/contribute',
                        label: 'Make a Contribution',
                        newTab: false,
                      },
                      appearance: 'outline',
                    },
                  ],
                },
              },

              // Project Block - Featured Project
              {
                type: 'block',
                version: 1,
                fields: {
                  blockType: 'projectBlock',
                  blockName: 'Featured Project',
                  title: 'Global Village International Training Center',
                  description: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: 'Our flagship project to create a world-class international training center that will serve as a hub for cultural exchange, education, and community development programs.',
                            },
                          ],
                          version: 1,
                        },
                        {
                          type: 'heading',
                          tag: 'h3',
                          children: [{ type: 'text', text: 'Project Goals' }],
                          version: 1,
                        },
                        {
                          type: 'list',
                          listType: 'bullet',
                          children: [
                            {
                              type: 'listItem',
                              children: [
                                {
                                  type: 'text',
                                  text: 'Create a modern training facility with state-of-the-art equipment',
                                },
                              ],
                              version: 1,
                            },
                            {
                              type: 'listItem',
                              children: [
                                {
                                  type: 'text',
                                  text: 'Establish programs for international cultural exchange',
                                },
                              ],
                              version: 1,
                            },
                            {
                              type: 'listItem',
                              children: [
                                {
                                  type: 'text',
                                  text: 'Provide educational opportunities for local and international participants',
                                },
                              ],
                              version: 1,
                            },
                            {
                              type: 'listItem',
                              children: [
                                {
                                  type: 'text',
                                  text: 'Foster community development through collaborative programs',
                                },
                              ],
                              version: 1,
                            },
                          ],
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                  },
                  image: demoImage.id,
                  status: 'in-progress',
                  progress: 75,
                  startDate: '2024-01-01',
                  endDate: '2025-12-31',
                  budget: {
                    total: 500000,
                    raised: 375000,
                    currency: '€',
                  },
                  tags: [
                    { tag: 'Education' },
                    { tag: 'International' },
                    { tag: 'Community' },
                    { tag: 'Infrastructure' },
                  ],
                  links: [
                    {
                      label: 'Project Details',
                      url: '/village',
                      type: 'website',
                    },
                    {
                      label: 'Contribute to Project',
                      url: '/contribute',
                      type: 'website',
                    },
                  ],
                },
              },

              // Impact Block - Secondary Stats
              {
                type: 'block',
                version: 1,
                fields: {
                  blockType: 'impactBlock',
                  blockName: 'Program Impact',
                  title: 'Program Success Metrics',
                  subtitle:
                    'Measuring the effectiveness and reach of our various community programs.',
                  metrics: [
                    {
                      label: 'Training Sessions Completed',
                      value: 240,
                      icon: 'Award',
                      color: 'blue',
                      animateOnScroll: true,
                    },
                    {
                      label: 'Cultural Events Organized',
                      value: 85,
                      icon: 'Calendar',
                      color: 'purple',
                      animateOnScroll: true,
                    },
                    {
                      label: 'Partnerships Established',
                      value: 32,
                      icon: 'Users',
                      color: 'green',
                      animateOnScroll: true,
                    },
                  ],
                  layout: 'grid-3',
                  background: 'gradient',
                  textAlign: 'center',
                },
              },

              // Content with Image Block
              {
                type: 'block',
                version: 1,
                fields: {
                  blockType: 'contentWithImage',
                  blockName: 'About Our Approach',
                  title: 'Community-Centered Development',
                  description: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: 'At HawkStars, we believe in the power of community-driven development. Our approach centers on empowering local communities while fostering international connections and cultural exchange.',
                            },
                          ],
                          version: 1,
                        },
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: 'Through our various programs and initiatives, we create opportunities for learning, growth, and collaboration that benefit both local participants and our international network of partners and supporters.',
                            },
                          ],
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                  },
                  image: demoImage.id,
                  imagePosition: 'left',
                },
              },

              // Column Based Block
              {
                type: 'block',
                version: 1,
                fields: {
                  blockType: 'columnBased',
                  blockName: 'Our Values',
                  columns: [
                    {
                      icon: 'Heart',
                      title: 'Community First',
                      subtitle: 'Putting community needs at the center of everything we do',
                      list: [
                        { item: 'Local community engagement' },
                        { item: 'Inclusive decision-making processes' },
                        { item: 'Sustainable development practices' },
                        { item: 'Cultural sensitivity and respect' },
                      ],
                    },
                    {
                      icon: 'Globe',
                      title: 'Global Perspective',
                      subtitle: 'Connecting local communities with international opportunities',
                      list: [
                        { item: 'Cross-cultural exchange programs' },
                        { item: 'International partnerships' },
                        { item: 'Global best practice sharing' },
                        { item: 'Multicultural collaboration' },
                      ],
                    },
                    {
                      icon: 'Target',
                      title: 'Impact Focused',
                      subtitle: 'Measuring success through meaningful community outcomes',
                      list: [
                        { item: 'Evidence-based program design' },
                        { item: 'Regular impact assessment' },
                        { item: 'Transparent reporting' },
                        { item: 'Continuous improvement' },
                      ],
                    },
                  ],
                },
              },

              // Final Text Block - Conclusion
              {
                type: 'block',
                version: 1,
                fields: {
                  blockType: 'textBlock',
                  blockName: 'Showcase Conclusion',
                  content: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'heading',
                          tag: 'h2',
                          children: [{ type: 'text', text: 'Endless Possibilities' }],
                          version: 1,
                        },
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: 'This showcase demonstrates the flexibility and power of our content management system. Content editors can combine these blocks in countless ways to create engaging, informative pages that serve their specific needs.',
                            },
                          ],
                          version: 1,
                        },
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: 'Each block is designed to be user-friendly, accessible, and optimized for both desktop and mobile experiences. The modular approach ensures consistency while allowing for creative flexibility.',
                            },
                          ],
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                  },
                  textAlign: 'center',
                  maxWidth: 'medium',
                },
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        meta: {
          title: 'Block Showcase - All Available Blocks Demo | HawkStars',
          description:
            'Comprehensive demonstration of all available content blocks in the HawkStars CMS, showcasing the flexibility and power of our content management system.',
        },
        publishedAt: new Date().toISOString(),
        _status: 'published',
      },
      locale: 'en', // Create in English first
    });

    console.log('🎉 Successfully created demo page:', demoPage.slug);
    console.log('📄 Page ID:', demoPage.id);
    console.log('🌐 Access at: /en/block-showcase');
  } catch (error) {
    console.error('❌ Error creating demo page:', error);
  }
};
