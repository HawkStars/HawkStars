// Helper to create footer link items
const createFooterLink = (label: string, url: string = '#') => ({
  id: `link-${label.toLowerCase().replace(/\s+/g, '-')}`,
  link: {
    type: 'custom' as const,
    label,
    url,
    newTab: false,
  },
});

const DUMMY_FOOTER_INFO = [
  {
    id: 'about-column',
    column: {
      title: 'About HawkStars',
      data: [
        createFooterLink('Our Mission', '/about'),
        createFooterLink('Team', '/team'),
        createFooterLink('History', '/history'),
        createFooterLink('Partners', '/partners'),
      ],
    },
  },
  {
    id: 'projects-column',
    column: {
      title: 'Projects',
      data: [
        createFooterLink('Global Village', '/village'),
        createFooterLink('Art Collection', '/art'),
        createFooterLink('Events', '/events'),
      ],
    },
  },
  {
    id: 'resources-column',
    column: {
      title: 'Resources',
      data: [
        createFooterLink('News', '/news'),
        createFooterLink('Transparency', '/transparency'),
        createFooterLink('Contribute', '/contribute'),
      ],
    },
  },
  {
    id: 'legal-column',
    column: {
      title: 'Legal',
      data: [
        createFooterLink('Terms & Conditions', '/terms'),
        createFooterLink('Privacy Policy', '/privacy'),
      ],
    },
  },
  {
    id: 'contact-column',
    column: {
      title: 'Contact',
      data: [
        createFooterLink('Contact Us', '/contact'),
        createFooterLink('Support', '/support'),
        createFooterLink('FAQs', '/faqs'),
      ],
    },
  },
];

export { DUMMY_FOOTER_INFO, createFooterLink };
