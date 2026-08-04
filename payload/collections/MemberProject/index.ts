import type { CollectionConfig } from 'payload';
import { anyone } from '../../access/anyone';
import { authenticated } from '../../access/authenticated';
import { notifyMemberProject } from './hooks';
import { GROUP_LABELS } from '@/payload/constants';
import { checkConfirmedByAdmin } from './hooks/checkConfirmedByAdmin';
import { checkProjectUrl } from './hooks/validateProjectUrl';

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
    singular: { en: 'Member Project', pt: 'Projeto de Membro' },
    plural: { en: 'Member Projects', pt: 'Projetos de Membros' },
  },
  admin: {
    defaultColumns: ['title', 'is_confirmed', 'submitter_name', 'createdAt'],
    useAsTitle: 'title',
    description:
      'Projects submitted by members for the "Corner of the Members" showcase. ' +
      'Verify the submitter is a paid-up, trusted member before checking "Confirmed". ' +
      'Only confirmed projects appear on the public showcase.',
    group: {
      ...GROUP_LABELS.management,
    },
  },
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [notifyMemberProject],
    beforeValidate: [checkConfirmedByAdmin],
    beforeChange: [checkProjectUrl],
  },
  fields: [
    /* -------------------------------------------------------------- */
    /*  MODERATION (sidebar) — admins only effectively, via access     */
    /* -------------------------------------------------------------- */
    {
      name: 'is_confirmed',
      label: { en: 'Confirmed', pt: 'Confirmado' },
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: {
          en: 'Check this only after confirming the submitter is a trusted member who has paid their membership. The project appears on the public showcase only when this is checked.',
          pt: 'Marque apenas após confirmar que o submetente é um membro de confiança que pagou a sua quota. O projeto aparece na montra pública apenas quando esta opção está marcada.',
        },
      },
      access: {
        create: () => false,
        update: ({ req }) => Boolean(req.user?.isAdmin),
        read: ({ req: { user } }) => Boolean(user),
      },
      hooks: {
        beforeValidate: [
          ({ data, req, operation }) =>
            operation === 'create' && !req.user ? { ...data, is_confirmed: false } : data,
        ],
      },
    },

    /* -------------------------------------------------------------- */
    /*  CORE CONTENT                                                  */
    /* -------------------------------------------------------------- */
    {
      name: 'title',
      label: { en: 'Title', pt: 'Título' },
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: { en: 'Description', pt: 'Descrição' },
      type: 'textarea',
      required: true,
      admin: { rows: 6 },
    },
    {
      name: 'language',
      label: { en: 'Content Language', pt: 'Idioma do Conteúdo' },
      type: 'select',
      required: true,
      defaultValue: 'pt',
      admin: {
        description: {
          en: 'The language the project information is written in.',
          pt: 'O idioma em que a informação do projeto está escrita.',
        },
      },
      options: [
        { label: { pt: 'Português', en: 'Portuguese' }, value: 'pt' },
        { label: { pt: 'Inglês', en: 'English' }, value: 'en' },
        { label: { pt: 'Espanhol', en: 'Spanish' }, value: 'es' },
        { label: { pt: 'Francês', en: 'French' }, value: 'fr' },
        { label: { pt: 'Alemão', en: 'German' }, value: 'de' },
        { label: { pt: 'Italiano', en: 'Italian' }, value: 'it' },
        { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
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
          label: { en: 'Image URL', pt: 'URL da Imagem' },
          type: 'text',
          admin: {
            width: '50%',
            description: {
              en: 'Link to an image representing the project.',
              pt: 'Link para uma imagem que representa o projeto.',
            },
          },
        },
        {
          name: 'video_url',
          label: { en: 'Video URL', pt: 'URL do Vídeo' },
          type: 'text',
          admin: {
            width: '50%',
            description: {
              en: 'Link to a video (e.g. YouTube or Vimeo).',
              pt: 'Link para um vídeo (ex: YouTube ou Vimeo).',
            },
          },
        },
      ],
    },

    /* -------------------------------------------------------------- */
    /*  DATES — upcoming happenings, each with a follow-up link         */
    /* -------------------------------------------------------------- */
    {
      name: 'dates',
      label: { en: 'Dates / Happenings', pt: 'Datas / Acontecimentos' },
      type: 'array',
      admin: {
        description: {
          en: 'Dates of things that are going to happen, each with a link where others can follow for more information.',
          pt: 'Datas de acontecimentos futuros, cada um com um link para mais informações.',
        },
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              label: { en: 'What is happening', pt: 'O que está a acontecer' },
              type: 'text',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'date',
              label: { en: 'Date', pt: 'Data' },
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
              label: { en: 'More info link', pt: 'Link para mais informação' },
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
      label: { en: 'Submitter', pt: 'Submetente' },
      admin: {
        description: {
          en: 'Contact details of the member who submitted this project (admin only).',
          pt: 'Dados de contacto do membro que submeteu este projeto (apenas para administradores).',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'submitter_name',
              label: { en: 'Name', pt: 'Nome' },
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'submitter_email',
              label: { en: 'Email', pt: 'Email' },
              type: 'email',
              required: true,
              admin: { width: '50%' },
              access: {
                read: ({ req }) => req.user?.isAdmin || false,
              },
            },
          ],
        },
      ],
    },
  ],
};
