import type { CollectionConfig } from 'payload';
import { SocialLinksField } from './objects/SocialLink';

export const BoardMember: CollectionConfig = {
  slug: 'board-members',
  labels: {
    singular: 'Board Member',
    plural: 'Board Members',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'section', 'position'],
    listSearchableFields: ['name', 'title', 'section'],
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'section',
      label: 'Section',
      type: 'radio',
      required: true,
      admin: {
        description: 'Section out of the three that is to add the member',
      },
      options: [
        { label: 'Assembleia Geral', value: 'geral' },
        { label: 'Conselho Fiscal', value: 'fiscal' },
        { label: 'Direção', value: 'board' },
      ],
    },
    {
      name: 'title',
      label: 'Position Title',
      type: 'select',
      required: true,
      options: [
        { label: 'Presidente', value: 'president' },
        { label: 'Vice-Presidente', value: 'vice_president' },
        { label: 'Vogal', value: 'vogal' },
        { label: 'Secretária', value: 'f_secretary' },
        { label: 'Secretário', value: 'm_secretary' },
        { label: 'Suplente', value: 'substitute' },
        { label: 'Tesoureiro', value: 'treasurer' },
        { label: 'Secretário Relator', value: 'rapporteur_secretary' },
      ],
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media', // Assumes you have a 'media' collection for file uploads
      // If you need multiple images, use:
      // type: 'array',
      // of: [
      //   {
      //     type: 'upload',
      //     relationTo: 'media',
      //   },
      // ],
    },
    { ...SocialLinksField },
    {
      name: 'position',
      label: 'Position',
      type: 'number',
      admin: {
        description: 'Position to be ordered to be shown on the page',
        step: 1,
      },
      required: true,
    },
  ],
};
