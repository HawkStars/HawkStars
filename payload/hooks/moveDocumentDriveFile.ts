import type { CollectionAfterChangeHook } from 'payload';
import type { HawkDocument } from '@/payload-types';
import { captureException } from '@/lib/sentry/cli-client';
import { moveGoogleDriveFile } from '@/lib/google-drive/adapter';

/**
 * Keeps a document's Google Drive file in the folder its `folder` field names.
 *
 * The Drive adapter only places a file when it is uploaded, so changing `folder` on an existing
 * document (without replacing the file) used to leave the file in its old Drive folder.
 *
 * Skipped when a file is part of this request — the adapter uploads that one straight into the
 * new folder — and on the cloud-storage plugin's internal metadata write-back. A failed move is
 * reported but never blocks the edit: the folder only organises Drive, the public URL does not
 * depend on it.
 */
export const moveDocumentDriveFile: CollectionAfterChangeHook<HawkDocument> = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (operation !== 'update') return doc;
  if (req.context?.skipCloudStorage || req.file) return doc;
  if (!doc.filename || doc.filename !== previousDoc?.filename) return doc;
  if ((doc.folder ?? null) === (previousDoc?.folder ?? null)) return doc;

  try {
    await moveGoogleDriveFile(doc.filename, doc.folder);
  } catch (error) {
    captureException(error, {
      extra: { documentId: doc.id, fileId: doc.filename, folder: doc.folder },
    });
  }
  return doc;
};
