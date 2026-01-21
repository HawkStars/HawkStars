import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const NewsletterSignupBlock: Block = {
  slug: 'newsletterSignup',
  interfaceName: 'NewsletterSignupBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Stay Updated',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Subscribe',
      localized: true,
    },
    SectionID,
  ],
  labels: {
    plural: 'Newsletter Signups',
    singular: 'Newsletter Signup',
  },
};
