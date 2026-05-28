import type { CollectionConfig } from 'payload';
import { anyone } from '../../access/anyone';
import { authenticated } from '../../access/authenticated';
import { notifyOnMemberProject } from '../../hooks/notifyOnMemberProject';

/**
 * MemberProject — "Corner of the Members"
 *
 * Paid members submit their own projects through a public form. Submissions are
 * stored with `is_confirmed = false`. A Payload admin verifies that the submitter
 * is a trusted, paid-up member and then flips `is_confirmed` to true, at which
 * point the project becomes visible on the public showcase.
 *
 * Access model:
 *  - create: anyone (the public submission form, no login required)
 *  - read:   anyone (the frontend query filters to confirmed projects only)
 *  - update / delete / admin: authenticated (admins confirm / moderate)
 */
export const MemberProject: CollectionConfig = {
  slug: 'member_projects',
  labels: {
    singular: 'Member Project',
    plural: 'Member Projects',
  },
  admin: {
    defaultColumns: ['title', 'is_confirmed', 'submitter_name', 'createdAt'],
    useAsTitle: 'title',
    description:
      'Projects submitted by members for the "Corner of the Members" showcase. ' +
      'Verify the submitter is a paid-up, trusted member before checking "Confirmed". ' +
      'Only confirmed projects appear on the public showcase.',
    group: {
      name: 'Daily Work',
    },
  },
  access: {
    admin: authenticated,
    read: anyone,
    create: anyone,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [notifyOnMemberProject],
  },
  fields: [
    /* -------------------------------------------------------------- */
    /*  MODERATION (sidebar) — admins only effectively, via access     */
    /* -------------------------------------------------------------- */
    {
      name: 'is_confirmed',
      label: 'Confirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Check this only after confirming the submitter is a trusted member who has paid ' +
          'their membership. The project appears on the public showcase only when this is checked.',
      },
    },

    /* -------------------------------------------------------------- */
    /*  CORE CONTENT                                                  */
    /* -------------------------------------------------------------- */
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      admin: { rows: 6 },
    },
    {
      name: 'language',
      label: 'Content Language',
      type: 'select',
      required: true,
      defaultValue: 'pt',
      admin: {
        description: 'The language the project information is written in.',
      },
      options: [
        { label: 'Portuguese', value: 'pt' },
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
        { label: 'Italian', value: 'it' },
        { label: 'Other', value: 'other' },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  MEDIA — external URLs only (image or video)                    */
    /* -------------------------------------------------------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'image_url',
          label: 'Image URL',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Link to an image representing the project.',
          },
        },
        {
          name: 'video_url',
          label: 'Video URL',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Link to a video (e.g. YouTube or Vimeo).',
          },
        },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  DATES — upcoming happenings, each with a follow-up link         */
    /* -------------------------------------------------------------- */
    {
      name: 'dates',
      label: 'Dates / Happenings',
      type: 'array',
      admin: {
        description:
          'Dates of things that are going to happen, each with a link where others can follow ' +
          'for more information.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              label: 'What is happening',
              type: 'text',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'date',
              label: 'Date',
              type: 'date',
              required: true,
              admin: {
                width: '30%',
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: 'dd/MM/yyyy',
                },
              },
            },
            {
              name: 'link',
              label: 'More info link',
              type: 'text',
              admin: { width: '30%' },
            },
          ],
        },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  SUBMITTER INFO — for the admin to verify membership            */
    /* -------------------------------------------------------------- */
    {
      type: 'group',
      name: 'submitter',
      label: 'Submitter',
      admin: {
        description: 'Contact details of the member who submitted this project (admin only).',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'submitter_name',
              label: 'Name',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'submitter_email',
              label: 'Email',
              type: 'email',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
};
