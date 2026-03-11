import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Populates the `publishedAt` field.
 *
 * Status-aware behavior:
 *   - If the collection uses the `status` field and the status is being set to 'published',
 *     set `publishedAt` to the current date (unless already provided).
 *   - If the collection does NOT use a `status` field (legacy behavior),
 *     fall back to setting `publishedAt` on create/update when not already set.
 *
 * This runs AFTER `validateStatusTransition`, which may already set `publishedAt`
 * when transitioning to published. This hook acts as a safety net.
 */
export const populatePublishedAt: CollectionBeforeChangeHook = ({
  data,
  operation,
  req,
  originalDoc,
}) => {
  if (operation !== 'create' && operation !== 'update') return data;

  const hasStatusField = data?.status !== undefined || originalDoc?.status !== undefined;

  if (hasStatusField) {
    // Status-aware: only populate when transitioning to 'published'
    const newStatus = data?.status;
    const prevStatus = originalDoc?.status;

    if (newStatus === 'published' && prevStatus !== 'published' && !data?.publishedAt) {
      return {
        ...data,
        publishedAt: new Date(),
      };
    }

    return data;
  }

  // Legacy behavior for collections without a status field
  if (req.data && !req.data.publishedAt) {
    return {
      ...data,
      publishedAt: new Date(),
    };
  }

  return data;
};
