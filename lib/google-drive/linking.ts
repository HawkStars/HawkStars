import { DOCUMENT_MIME_TYPES } from '@/payload/collections/documentMimeTypes';
import { ANYONE_WITH_LINK_PERMISSION_ID, isGoogleDriveFileId } from './adapter';
import { getDrive } from './auth';

/**
 * Read-side helpers for linking files that already live in other Google Drive folders to
 * Documents entries, without copying them.
 *
 * Every call passes `supportsAllDrives` so files in shared drives work as well as files in
 * someone's My Drive. Only files the HawkStars Google account can see are reachable.
 */

const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const GOOGLE_NATIVE_PREFIX = 'application/vnd.google-apps.';

export type DriveEntry = {
  id: string;
  name: string;
  mimeType: string;
  isFolder: boolean;
  size?: number;
  modifiedTime?: string;
  isPublic: boolean;
  /** Whether it can be linked as a document as-is (allowed type, not a folder or Google Doc). */
  linkable: boolean;
  /** Why it cannot be linked, when `linkable` is false. */
  reason?: string;
};

/**
 * Accepts a bare Drive ID or any common Drive/Docs link and returns the ID:
 * `/file/d/<id>`, `/folders/<id>`, `/document/d/<id>`, `?id=<id>`.
 * Returns undefined when nothing ID-shaped is found.
 */
export function parseDriveId(input: string): string | undefined {
  const value = input.trim();
  if (isGoogleDriveFileId(value)) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return undefined;
  }
  if (!/(^|\.)google\.com$/.test(url.hostname)) return undefined;

  const fromPath =
    /\/(?:file\/d|folders|document\/d|spreadsheets\/d|presentation\/d)\/([^/?#]+)/.exec(
      url.pathname
    )?.[1];
  const candidate = fromPath ?? url.searchParams.get('id') ?? undefined;
  return candidate && isGoogleDriveFileId(candidate) ? candidate : undefined;
}

function describeLinkability(mimeType: string): { linkable: boolean; reason?: string } {
  if (mimeType === FOLDER_MIME_TYPE) return { linkable: false, reason: 'folder' };
  if (mimeType.startsWith(GOOGLE_NATIVE_PREFIX)) {
    return {
      linkable: false,
      reason:
        'Google Docs/Sheets/Slides file — it has no downloadable file. Export it to PDF/Office in Drive first.',
    };
  }
  if (!DOCUMENT_MIME_TYPES.includes(mimeType)) {
    return { linkable: false, reason: `file type ${mimeType} is not allowed for documents` };
  }
  return { linkable: true };
}

type RawDriveFile = {
  id?: string | null;
  name?: string | null;
  mimeType?: string | null;
  size?: string | null;
  modifiedTime?: string | null;
  permissionIds?: string[] | null;
  trashed?: boolean | null;
};

function toEntry(file: RawDriveFile): DriveEntry {
  const mimeType = file.mimeType ?? 'application/octet-stream';
  return {
    id: file.id ?? '',
    name: file.name ?? '',
    mimeType,
    isFolder: mimeType === FOLDER_MIME_TYPE,
    size: file.size ? Number(file.size) : undefined,
    modifiedTime: file.modifiedTime ?? undefined,
    isPublic: Boolean(file.permissionIds?.includes(ANYONE_WITH_LINK_PERMISSION_ID)),
    ...describeLinkability(mimeType),
  };
}

const FILE_FIELDS = 'id, name, mimeType, size, modifiedTime, permissionIds, trashed';

/** List the files and subfolders directly inside a Drive folder, folders first. */
export async function listDriveFolder(
  folderId: string,
  options: { pageToken?: string; pageSize?: number } = {}
): Promise<{ entries: DriveEntry[]; nextPageToken?: string }> {
  const drive = getDrive();
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: `nextPageToken, files(${FILE_FIELDS})`,
    orderBy: 'folder, name',
    pageSize: Math.min(Math.max(options.pageSize ?? 100, 1), 200),
    pageToken: options.pageToken,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  return {
    entries: (response.data.files ?? []).map(toEntry),
    nextPageToken: response.data.nextPageToken ?? undefined,
  };
}

/** Fetch one file's metadata. Throws (404) when the account cannot see it. */
export async function getDriveEntry(fileId: string): Promise<DriveEntry & { trashed: boolean }> {
  const drive = getDrive();
  const { data } = await drive.files.get({
    fileId,
    fields: FILE_FIELDS,
    supportsAllDrives: true,
  });
  return { ...toEntry(data), trashed: Boolean(data.trashed) };
}

/**
 * Share a file as "anyone with the link can view". Needs edit rights on the file; Drive
 * answers 403 otherwise.
 */
export async function shareDriveFilePublicly(fileId: string): Promise<void> {
  const drive = getDrive();
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
    supportsAllDrives: true,
  });
}
