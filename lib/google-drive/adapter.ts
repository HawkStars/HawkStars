import type { HandleUpload, HandleDelete } from '@payloadcms/plugin-cloud-storage/types';
import type { drive_v3 } from '@googleapis/drive';

import { Readable } from 'stream';
import { captureException } from '@/lib/sentry/cli-client';
import { getDrive } from './auth';

const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const DEFAULT_FOLDER = 'general';

/**
 * Drive's own permission ID for the "anyone with the link" grant, so it can be revoked
 * without listing permissions first.
 */
export const ANYONE_WITH_LINK_PERMISSION_ID = 'anyoneWithLink';

/**
 * Every document folder lives at the root of the account's My Drive (`root` is Drive's alias for
 * it). Scoping lookups to a parent matters: an unscoped `name='reports'` query also matches
 * folders other people have shared with the account, which would receive our uploads.
 */
const ROOT_FOLDER_ID = 'root';

/**
 * Escape a value for interpolation into a Google Drive query string.
 *
 * Drive's query language delimits string literals with single quotes and escapes with
 * backslashes, so an unescaped apostrophe in a folder name (`Projeto d'Arte`) breaks
 * the query, and a crafted one changes which files it matches.
 */
const escapeDriveQueryValue = (value: string) => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

/** HTTP status of a googleapis (gaxios) error, if it has one. */
export function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  const { status, code } = error as { status?: unknown; code?: unknown };
  if (typeof status === 'number') return status;
  if (typeof code === 'number') return code;
  return undefined;
}

/**
 * Checks whether a string looks like a Google Drive file ID.
 * Drive IDs are alphanumeric strings (with hyphens/underscores), typically 25-60 chars.
 * They never contain dots or spaces (unlike filenames such as "test.xlsx").
 */
export function isGoogleDriveFileId(value: string): boolean {
  return /^[a-zA-Z0-9_-]{20,}$/.test(value);
}

async function findOrCreateDriveFolder(
  drive: drive_v3.Drive,
  folderName: string,
  parentId: string
): Promise<string> {
  const response = await drive.files.list({
    q:
      `name='${escapeDriveQueryValue(folderName)}' and '${escapeDriveQueryValue(parentId)}' in parents ` +
      `and mimeType='${FOLDER_MIME_TYPE}' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive',
    // Oldest first, so if duplicates already exist every upload converges on the same one.
    orderBy: 'createdTime',
    pageSize: 10,
  });

  const existing = response.data.files?.find((f) => f.name === folderName && f.id);
  if (existing?.id) return existing.id;

  const created = await drive.files.create({
    requestBody: { name: folderName, mimeType: FOLDER_MIME_TYPE, parents: [parentId] },
    fields: 'id',
  });
  if (!created.data.id)
    throw new Error(`Google Drive did not return an ID for folder "${folderName}"`);
  return created.data.id;
}

/**
 * Folder IDs keyed by `parentId/folderName`. The cached value is the promise, not the ID, so
 * concurrent uploads (Documents has `bulkUpload: true`) share one in-flight lookup instead of
 * each finding nothing and each creating its own duplicate folder.
 */
const folderIdCache = new Map<string, Promise<string>>();

function getOrCreateDriveFolder(drive: drive_v3.Drive, folderName: string): Promise<string> {
  const parentId = ROOT_FOLDER_ID;
  const key = `${parentId}/${folderName}`;

  let pending = folderIdCache.get(key);
  if (!pending) {
    pending = findOrCreateDriveFolder(drive, folderName, parentId);
    folderIdCache.set(key, pending);
    // Never cache a failure — the next upload should retry the lookup.
    pending.catch(() => folderIdCache.delete(key));
  }
  return pending;
}

/** Drop a cached folder ID, e.g. after the folder was deleted by hand in Drive. */
function forgetDriveFolder(folderName: string) {
  folderIdCache.delete(`${ROOT_FOLDER_ID}/${folderName}`);
}

/** Test-only: reset the in-memory folder cache between cases. */
export function __resetGoogleDriveFolderCache() {
  folderIdCache.clear();
}

export const googleDriveAdapter = () => ({
  name: 'google-drive-adapter',

  /**
   * Runs in the cloud-storage plugin's `afterChange` hook, i.e. AFTER Payload has saved the
   * document with the original filename. Only the returned object is persisted (the plugin
   * writes it back with a second update), so the Drive file ID must be returned, not assigned
   * onto `file`. Throwing here fails the request; whether the already-saved document is rolled
   * back depends on MongoDB transactions being available (replica set).
   */
  async handleUpload({ file, data }: Parameters<HandleUpload>[0]) {
    const drive = getDrive();
    const folder: string = data?.folder || DEFAULT_FOLDER;
    let fileId: string | null | undefined;

    try {
      const folderId = await getOrCreateDriveFolder(drive, folder);

      const buffer = file.buffer instanceof Buffer ? file.buffer : Buffer.from(file.buffer);

      const response = await drive.files.create({
        requestBody: { name: file.filename, parents: [folderId] },
        media: { mimeType: file.mimeType, body: Readable.from(buffer) },
        fields: 'id, size',
      });

      fileId = response.data.id;
      if (!fileId) throw new Error('Google Drive upload failed: no file ID returned');

      // Documents are public (collection read: anyone) and served straight from Drive.
      await drive.permissions.create({
        fileId,
        requestBody: { role: 'reader', type: 'anyone' },
      });

      return {
        filename: fileId,
        filesize: Number(response.data.size) || file.filesize,
      };
    } catch (error) {
      // A 404 usually means the cached parent folder was removed in Drive; re-resolve next time.
      if (getErrorStatus(error) === 404) forgetDriveFolder(folder);

      // The file landed but could not be shared: remove it rather than leave an orphan that no
      // document points to.
      if (fileId) {
        await drive.files.delete({ fileId }).catch((cleanupError) =>
          captureException(cleanupError, {
            extra: { fileId, note: 'Orphaned Google Drive file after a failed upload' },
          })
        );
      }

      captureException(error, { extra: { folder, originalFilename: file.filename } });
      throw error;
    }
  },

  async handleDelete({ filename, doc }: Parameters<HandleDelete>[0]) {
    // filename holds the Google Drive file ID. Documents saved before Drive was configured
    // (or whose upload failed) still carry the original name — nothing to delete in Drive.
    if (!filename || !isGoogleDriveFileId(filename)) return;

    // A linked file lives in someone else's Drive folder and is only referenced by this entry.
    // Deleting the entry (or replacing its file) must never delete the original.
    if ((doc as { source?: string | null } | undefined)?.source === 'linked') return;

    const drive = getDrive();
    try {
      await drive.files.delete({ fileId: filename });
    } catch (error) {
      if (getErrorStatus(error) === 404) return; // already gone

      // The document is deleted in Payload regardless. If the Drive file survives, at least
      // make sure its public link stops working.
      const revoked = await drive.permissions
        .delete({ fileId: filename, permissionId: ANYONE_WITH_LINK_PERMISSION_ID })
        .then(() => true)
        .catch((revokeError) => getErrorStatus(revokeError) === 404);

      captureException(error, {
        extra: {
          fileId: filename,
          publicLinkRevoked: revoked,
          note: revoked
            ? 'Drive file could not be deleted; public link was revoked. Remove it manually.'
            : 'Drive file could not be deleted AND is still publicly shared. Remove it manually.',
        },
      });
    }
  },

  staticHandler() {
    return new Response('Not implemented', { status: 501 });
  },
});

/**
 * Move a document's Drive file into the folder named by its `folder` field. Used when the
 * folder is changed on an existing document without uploading a new file.
 */
export async function moveGoogleDriveFile(fileId: string, folder: string | null | undefined) {
  if (!isGoogleDriveFileId(fileId)) return;

  const drive = getDrive();
  const targetFolderId = await getOrCreateDriveFolder(drive, folder || DEFAULT_FOLDER);

  const { data } = await drive.files.get({ fileId, fields: 'parents' });
  const currentParents = data.parents ?? [];
  if (currentParents.length === 1 && currentParents[0] === targetFolderId) return;

  await drive.files.update({
    fileId,
    addParents: targetFolderId,
    removeParents: currentParents.filter((id) => id !== targetFolderId).join(',') || undefined,
    fields: 'id',
  });
}

/**
 * Public download URL for a Google Drive file.
 *
 * Called from the plugin's `url` field hooks on every read and save. It is also called once per
 * upload with the original filename (e.g. `report.pdf`) before the Drive ID is written back,
 * so a non-ID value is expected and not reported — the upload path reports real failures.
 *
 * @param fileId - The Google Drive file ID (stored as filename in Payload)
 */
export function generateGoogleDriveURL(fileId: string): string {
  if (!fileId || !isGoogleDriveFileId(fileId)) return '';
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}
