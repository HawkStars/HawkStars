import type { CollectionConfig } from 'payload';
import { SocialLinksField } from '../fields/Link/SocialLink';

import { authenticated } from '../access/authenticated';

export const BoardMember: CollectionConfig = {
  slug: 'board-members',
  labels: {
    singular: 'Board Member',
    plural: 'Board Members',
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    admin: authenticated,
  },
  defaultPopulate: {
    name: true,
    section: true,
    title: true,
    department: true,
    position: true,
    photo: true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'section', 'position'],
    description: 'Board Members of the Association',
    listSearchableFields: ['name', 'title', 'section'],
    pagination: {
      defaultLimit: 50,
      limits: [25, 50, 100],
    },
    components: {
      views: {
        list: {
          Component: '@/payload/components/admin/BoardMemberListView',
        },
      },
    },
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      localized: false,
    },
    {
      name: 'section',
      label: 'Section',
      type: 'radio',
      required: true,
      localized: false,
      admin: {
        description: 'Section out of the three that is to add the member',
      },
      options: [
        { label: 'Assembleia Geral', value: 'geral' },
        { label: 'Conselho Fiscal', value: 'fiscal' },
        { label: 'Direção', value: 'board' },
        { label: 'Conselho Consultivo', value: 'advisory' },
        { label: 'Gaming Staff', value: 'gaming' },
      ],
    },
    {
      name: 'title',
      label: 'Position Title',
      type: 'select',
      required: true,
      localized: false,
      options: [
        { label: 'Presidente', value: 'president' },
        { label: 'Vice-Presidente', value: 'vice_president' },
        { label: 'Vogal', value: 'vogal' },
        { label: 'Secretária', value: 'f_secretary' },
        { label: 'Secretário', value: 'm_secretary' },
        { label: 'Suplente', value: 'substitute' },
        { label: 'Tesoureiro', value: 'treasurer' },
        { label: 'Secretário Relator', value: 'rapporteur_secretary' },
        { label: 'Departamento', value: 'department' },
        { label: 'Coordenador de Gaming', value: 'gaming_coordinator' },
        { label: 'Staff de Gaming', value: 'gaming_staff' },
        { label: 'Membro Consultivo', value: 'advisory_member' },
        { label: 'Outro', value: 'other' },
        { label: 'Diretor de Arte', value: 'art_director' },
        { label: 'Curador', value: 'curator' },
        { label: 'Coordenador de Projetos', value: 'project_coordinator' },
        { label: 'Gerente de Parcerias', value: 'partnerships_manager' },
      ],
    },
    {
      name: 'department',
      label: 'Department',
      type: 'text',
      required: false,
      localized: true,
      admin: {
        description: 'Only for board members in a department',
        condition: (data, siblingData) => siblingData.title === 'department',
      },
    },
    {
      name: 'photo',
      label: 'Photo',
      type: 'upload',
      relationTo: 'media',
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
