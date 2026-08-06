import type { CollectionConfig } from 'payload';
import { SocialLinksField } from '../fields/Link/SocialLink';

import { authenticated } from '../access/authenticated';
import { GROUP_LABELS } from '../constants';
import { createRevalidateHooks } from '../utilities/revalidateCollection';

export const BOARD_MEMBER_CACHE_TAG = 'board-members' as const;
const { afterChange: revalidateBoardMember, afterDelete: revalidateBoardMemberDelete } =
  createRevalidateHooks(BOARD_MEMBER_CACHE_TAG);

export const BoardMember: CollectionConfig = {
  slug: 'board-members',
  labels: {
    singular: { en: 'Board Member', pt: 'Membro da Direção' },
    plural: { en: 'Board Members', pt: 'Membros da Direção' },
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    admin: authenticated,
  },
  hooks: {
    afterChange: [revalidateBoardMember],
    afterDelete: [revalidateBoardMemberDelete],
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
    description: {
      en: 'Manage board member profiles across all sections (Assembleia Geral, Conselho Fiscal, Direção, and more). Add photos, titles, and social links. The position number controls display order on the website.',
      pt: 'Gira os perfis dos membros da direção em todas as secções (Assembleia Geral, Conselho Fiscal, Direção, e mais). Adicione fotos, títulos e links sociais. O número de posição controla a ordem de exibição no website.',
    },
    listSearchableFields: ['name', 'title', 'section'],
    pagination: {
      defaultLimit: 50,
      limits: [50, 100],
    },
    components: {
      views: {
        list: {
          Component: '@/payload/components/admin/BoardMemberListView',
        },
      },
    },
    group: {
      ...GROUP_LABELS.management,
    },
  },
  fields: [
    {
      name: 'name',
      label: { en: 'Name', pt: 'Nome' },
      type: 'text',
      required: true,
      localized: false,
    },
    {
      name: 'section',
      label: { en: 'Section', pt: 'Secção' },
      type: 'radio',
      required: true,
      localized: false,
      admin: {
        description: {
          en: 'Section out of the three that is to add the member',
          pt: 'Secção das três onde adicionar o membro',
        },
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
      label: { en: 'Position Title', pt: 'Título do Cargo' },
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
      label: { en: 'Department', pt: 'Departamento' },
      type: 'text',
      required: false,
      localized: true,
      admin: {
        description: {
          en: 'Only for board members in a department',
          pt: 'Apenas para membros da direção num departamento',
        },
      },
    },
    {
      name: 'photo',
      label: { en: 'Photo', pt: 'Fotografia' },
      type: 'upload',
      relationTo: 'media',
    },
    { ...SocialLinksField },
    {
      name: 'position',
      label: { en: 'Position', pt: 'Posição' },
      type: 'number',
      admin: {
        description: {
          en: 'Position to be ordered to be shown on the page',
          pt: 'Posição para ordenação na página',
        },
        step: 1,
      },
      required: true,
    },
  ],
};
