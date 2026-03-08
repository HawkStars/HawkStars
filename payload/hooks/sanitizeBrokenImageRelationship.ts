import { CollectionAfterReadHook } from 'payload';

/**
 * Sanitizes broken image relationships in documents that use PayloadImageField.
 *
 * When a referenced media document is deleted, the `image` field inside the
 * image group may hold a stale ID that Payload cannot resolve. This causes
 * the admin list view (and API responses) to throw errors.
 *
 * This hook runs after every read and ensures:
 * - If the image group exists and imageType is 'upload', but the `image`
 *   value is a raw string ID (not a populated object), it means the media
 *   document could not be found — so we clear it to prevent rendering failures.
 */
export const sanitizeBrokenImageRelationship: CollectionAfterReadHook = async ({ doc }) => {
  if (!doc?.image) return doc;

  const imageGroup = doc.image;

  // Only check upload-type images — external URLs are just strings and won't break
  if (imageGroup.imageType === 'upload' && imageGroup.image) {
    // When Payload successfully populates the relationship, `image` becomes an object.
    // If it's still a string (the raw ID), the referenced media document is missing.
    if (typeof imageGroup.image === 'string') {
      imageGroup.image = null;
    }
  }

  return doc;
};
