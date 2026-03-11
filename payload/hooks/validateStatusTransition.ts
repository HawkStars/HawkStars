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
 *   - Automatically sets `visible` to true and populates `publishedAt`
 *
 * On unpublish (move away from published):
 *   - Automatically sets `visible` to false
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

  // On create, default to draft regardless
  if (operation === 'create') {
    // Admins can create directly as published if they want
    if (newStatus === 'published' && !user.isAdmin) {
      return {
        ...data,
        status: 'draft',
        visible: false,
      };
    }

    if (newStatus === 'published') {
      return {
        ...data,
        visible: true,
        publishedAt: data?.publishedAt || new Date().toISOString(),
      };
    }

    return {
      ...data,
      visible: false,
    };
  }

  // On update, enforce transition rules
  if (operation === 'update' && newStatus !== previousStatus) {
    // Only admins can publish
    if (newStatus === 'published' && !user.isAdmin) {
      // Silently revert — editor tried to publish without permission
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

    // Handle side effects of status changes
    if (newStatus === 'published') {
      return {
        ...data,
        visible: true,
        publishedAt: data?.publishedAt || new Date().toISOString(),
      };
    }

    // Moving away from published → hide from site
    if (previousStatus === 'published' && newStatus !== 'published') {
      return {
        ...data,
        visible: false,
      };
    }
  }

  return data;
};
