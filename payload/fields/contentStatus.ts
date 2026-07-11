import type { Field } from 'payload';

/**
 * Shared status field for content collections (Pages, News).
 *
 * Workflow: draft → in_review → published
 *
 * - Editors can create drafts and submit them for review.
 * - Admins can approve (publish) or send back to draft.
 * - Anyone can move published content back to draft.
 */
export const contentStatusField: Field = {
  name: 'status',
  label: { en: 'Status', pt: 'Estado' },
  type: 'select',
  required: true,
  defaultValue: 'draft',
  options: [
    { label: { en: 'Draft', pt: 'Rascunho' }, value: 'draft' },
    { label: { en: 'In Review', pt: 'Em Revisão' }, value: 'in_review' },
    { label: { en: 'Published', pt: 'Publicado' }, value: 'published' },
  ],
  admin: {
    position: 'sidebar',
    description: {
      en: 'Draft → In Review → Published. Editors submit for review; Admins approve and publish.',
      pt: 'Rascunho → Em Revisão → Publicado. Os editores submetem para revisão; os administradores aprovam e publicam.',
    },
  },
};
