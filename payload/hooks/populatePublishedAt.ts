import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Populates the `publishedAt` field using Payload's native draft/publish status.
 *
 * When a document is published (`_status` transitions to 'published'), set
 * `publishedAt` to the current date unless it was explicitly provided. This
 * keeps the public-facing publish date in sync with Payload's built-in
 * versions/drafts workflow.
 */
export const populatePublishedAt: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  if (operation !== 'create' && operation !== 'update') return data;

  const newStatus = data?._status;
  const prevStatus = originalDoc?._status;

  if (newStatus === 'published' && prevStatus !== 'published' && !data?.publishedAt) {
    return {
      ...data,
      publishedAt: new Date(),
    };
  }

  return data;
};
