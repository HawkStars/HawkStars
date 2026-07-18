import type { CollectionConfig } from 'payload';
import { authenticated } from '@/payload/access/authenticated';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';
import { GROUP_LABELS } from '@/payload/constants';

export const Notification: CollectionConfig = {
  slug: 'notifications',
  labels: {
    singular: { en: 'Activity Log', pt: 'Registo de Atividade' },
    plural: { en: 'Activity Log', pt: 'Registo de Atividade' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'situation', 'actor', 'createdAt'],
    description: {
      en: 'Activity log recording who did what: logins and document changes across the admin.',
      pt: 'Registo de atividade que regista quem fez o quê: inícios de sessão e alterações de documentos no painel.',
    },
    group: {
      ...GROUP_LABELS.settings,
    },
  },
  access: {
    read: authenticated,
    create: authenticatedAdmin,
    update: authenticatedAdmin,
    delete: authenticatedAdmin,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'title',
      label: { en: 'Title', pt: 'Título' },
      type: 'text',
      required: true,
      admin: {
        description: { en: 'Short summary of what happened', pt: 'Resumo curto do que aconteceu' },
      },
    },
    {
      name: 'message',
      label: { en: 'Message', pt: 'Mensagem' },
      type: 'textarea',
      required: false,
      admin: {
        description: {
          en: 'Detailed notification message',
          pt: 'Mensagem detalhada da notificação',
        },
      },
    },
    {
      name: 'situation',
      label: { en: 'Situation', pt: 'Situação' },
      type: 'select',
      required: true,
      options: [
        { label: { en: 'Login', pt: 'Início de Sessão' }, value: 'login' },
        { label: { en: 'Creation', pt: 'Criação' }, value: 'create' },
        { label: { en: 'Update', pt: 'Atualização' }, value: 'update' },
        { label: { en: 'Deletion', pt: 'Eliminação' }, value: 'delete' },
        { label: { en: 'Message', pt: 'Mensagem' }, value: 'message' },
        { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
      ],
      defaultValue: 'other',
    },
    {
      name: 'actor',
      label: { en: 'Actor', pt: 'Autor' },
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        description: {
          en: 'The user who performed this action (empty for anonymous or system events).',
          pt: 'O utilizador que realizou esta ação (vazio para eventos anónimos ou do sistema).',
        },
      },
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Read', pt: 'Lida' },
      admin: {
        description: {
          en: 'Whether this notification has been read',
          pt: 'Se esta notificação foi lida',
        },
      },
    },
    {
      name: 'link',
      label: { en: 'Link', pt: 'Link' },
      type: 'text',
      required: false,
      admin: {
        description: {
          en: 'Admin panel link to the related document',
          pt: 'Link do painel de administração para o documento relacionado',
        },
      },
    },
    {
      name: 'relatedCollection',
      label: { en: 'Related Collection', pt: 'Coleção Relacionada' },
      type: 'text',
      required: false,
      admin: {
        description: {
          en: 'The collection slug this notification refers to',
          pt: 'O slug da coleção a que esta notificação se refere',
        },
      },
    },
    {
      name: 'relatedDocId',
      label: { en: 'Related Document ID', pt: 'ID do Documento Relacionado' },
      type: 'text',
      required: false,
      admin: {
        description: { en: 'The ID of the related document', pt: 'O ID do documento relacionado' },
      },
    },
  ],
};
