import type { CollectionBeforeChangeHook } from 'payload';
import type { User } from '@/payload-types';

/**
 * Validates content workflow status transitions based on user role.
 *
 * Rules:
 *   - Any authenticated user can set status to 'draft'
 *   - Editors (isEditor) can transition: draft → in_review
 *   - Admins (isAdmin) can transition to any status (draft, in_review, published)
 *   - Non-admin users CANNOT set status to 'published'
 *
 * On publish:
 *   - Populates `publishedAt` if not already set
 */
export const validateStatusTransition: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  req,
  operation,
}) => {
  const user = req.user as User | undefined;
  if (!user) return data;

  const previousStatus = originalDoc?.status || 'draft';
  const newStatus = data?.status || previousStatus;

  // On create, default to draft unless admin publishes directly
  if (operation === 'create') {
    if (newStatus === 'published' && !user.isAdmin) {
      return {
        ...data,
        status: 'draft',
      };
    }

    if (newStatus === 'published') {
      return {
        ...data,
        publishedAt: data?.publishedAt || new Date().toISOString(),
      };
    }

    return data;
  }

  // On update, enforce transition rules
  if (operation === 'update' && newStatus !== previousStatus) {
    // Only admins can publish
    if (newStatus === 'published' && !user.isAdmin) {
      return {
        ...data,
        status: previousStatus,
      };
    }

    // Editors can only go draft → in_review (not skip to published)
    if (
      newStatus === 'in_review' &&
      previousStatus !== 'draft' &&
      previousStatus !== 'published' &&
      !user.isAdmin
    ) {
      return {
        ...data,
        status: previousStatus,
      };
    }

    // Populate publishedAt when publishing
    if (newStatus === 'published') {
      return {
        ...data,
        publishedAt: data?.publishedAt || new Date().toISOString(),
      };
    }
  }

  return data;
};
