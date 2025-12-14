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
      name: 'placeholder',
      type: 'text',
      defaultValue: 'Enter your email',
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Subscribe',
    },
    {
      name: 'formAction',
      type: 'text',
      admin: {
        description: 'Form submission URL (e.g., Mailchimp endpoint)',
      },
    },
    {
      name: 'theme',
      type: 'select',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Gradient', value: 'gradient' },
      ],
      defaultValue: 'light',
    },
  ],
  labels: {
    plural: 'Newsletter Signups',
    singular: 'Newsletter Signup',
  },
};
