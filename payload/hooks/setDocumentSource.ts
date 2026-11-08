import { APIError, type CollectionBeforeChangeHook } from 'payload';
import type { HawkDocument } from '@/payload-types';

/**
 * `req.context` flag set only by the server-side "link an existing Drive file" path
 * (`linkDriveDocument` MCP tool). `req.context` cannot be set from REST/GraphQL, so callers
 * cannot mark their own records as linked.
 */
export const LINK_DRIVE_DOCUMENT_CONTEXT = 'linkDriveDocument';

/**
 * Decides `source` for Documents server-side, ignoring whatever the caller sent:
 *
 * - `linked`: the record points at a file that lives in someone else's Drive folder. The Drive
 *   adapter must never delete or move it (see handleDelete / moveDocumentDriveFile).
 * - `uploaded`: the file was uploaded by us and is ours to delete or move.
 *
 * The collection sets `filesRequiredOnCreate: false` so linked records can be created without an
 * upload; this hook puts the "a file is required" rule back for every other create. By the time
 * it runs, Payload has already processed any uploaded or URL-fetched file and set `filename`.
 */
export const setDocumentSource: CollectionBeforeChangeHook<HawkDocument> = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation === 'create') {
    const isLink = req.context?.[LINK_DRIVE_DOCUMENT_CONTEXT] === true;
    if (!data.filename) {
      throw new APIError('A file is required. Upload one, or link an existing Drive file.', 400);
    }
    data.source = isLink ? 'linked' : 'uploaded';
    return data;
  }

  // Replacing the file uploads a new one of our own; otherwise keep what was stored.
  data.source = req.file ? 'uploaded' : (originalDoc?.source ?? 'uploaded');
  return data;
};
