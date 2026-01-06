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
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Subscribe',
    },
    SectionID,
  ],
  labels: {
    plural: 'Newsletter Signups',
    singular: 'Newsletter Signup',
  },
};
