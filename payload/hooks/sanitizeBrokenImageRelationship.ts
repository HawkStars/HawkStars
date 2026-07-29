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

const sanitize = (node: unknown): void => {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) return node.forEach(sanitize);
  const obj = node as Record<string, unknown>;
  if (obj.imageType === 'upload' && typeof obj.image === 'string') {
    obj.image = null;
  }
  for (const v of Object.values(obj)) sanitize(v);
};

export const sanitizeBrokenImageRelationship: CollectionAfterReadHook = async ({ doc }) => {
  sanitize(doc);
  return doc;
};
