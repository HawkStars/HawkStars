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
  type: 'select',
  required: true,
  defaultValue: 'draft',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'In Review', value: 'in_review' },
    { label: 'Published', value: 'published' },
  ],
  admin: {
    position: 'sidebar',
    description:
      'Draft → In Review → Published. Editors submit for review; Admins approve and publish.',
  },
};

/**
 * Status badge colors for admin UI reference.
 */
export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  published: 'Published',
};
