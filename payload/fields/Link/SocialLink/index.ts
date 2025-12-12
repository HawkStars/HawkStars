import { ArrayField } from 'payload';

export const SocialLinksField: ArrayField = {
  name: 'links',
  label: 'Social Media Links',
  type: 'array',
  labels: {
    singular: 'Social Link',
    plural: 'Social Links',
  },
  admin: {
    description: 'Social Media Links for this entry',
    isSortable: true,
    components: {
      RowLabel: {
        path: '@/payload/fields/Link/SocialLink/components/SocialLinkRowLabel',
        exportName: 'SocialLinkRowLabel',
      },
    },
  },
  fields: [
    {
      name: 'platform',
      label: 'Platform',
      type: 'select',
      required: true,
      options: [
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Twitter', value: 'twitter' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'Website', value: 'website' },
        { label: 'Email', value: 'email' },
        { label: 'YouTube', value: 'youtube' },
        { label: 'GitHub', value: 'github' },
        { label: 'TikTok', value: 'tiktok' },
        { label: 'WhatsApp', value: 'whatsapp' },
      ],
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      required: true,
      validate: (value: string | null | undefined) => {
        if (!value) return true; // Let required handle empty values

        // Basic URL validation
        try {
          new URL(value);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      },
    },
    {
      name: 'isVisible',
      label: 'Visible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Toggle visibility of this link',
      },
    },
  ],
};
