import type { HandleUpload, HandleDelete } from '@payloadcms/plugin-cloud-storage/types';
import { drive_v3, google } from 'googleapis';

import { Readable } from 'stream';
import * as Sentry from '@sentry/nextjs';

function getAuth() {
  const oauth2Client = new google.auth.OAuth2({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  return oauth2Client;
}

function getDrive() {
  return google.drive({ version: 'v3', auth: getAuth() });
}

async function createDriveFolder(
  drive: drive_v3.Drive,
  folderName: string
): Promise<string | null> {
  // The metadata for the new folder.
  const folderMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  const folderId = await drive.files.create({
    requestBody: folderMetadata,
    fields: 'id',
  });
  return folderId.data.id ?? null;
}

async function getOrCreateDriveFolder(
  drive: drive_v3.Drive,
  folderName: string
): Promise<string | null> {
  try {
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (response.data.files?.length === 0) {
      return await createDriveFolder(drive, folderName);
    }

    const files = response.data.files;
    const file = files?.find((f) => f.name === folderName);
    return file?.id ?? null;
  } catch (err) {
    throw err;
  }
}

export const googleDriveAdapter = () => ({
  name: 'google-drive-adapter',

  async handleUpload({ file, data }: Parameters<HandleUpload>[0]) {
    try {
      const drive = getDrive();
      const folder = data?.folder || 'general';

      const folderId = await getOrCreateDriveFolder(drive, folder);
      if (!folderId) throw new Error('Failed to get or create Google Drive folder');

      const buffer = file.buffer instanceof Buffer ? file.buffer : Buffer.from(file.buffer);
      const stream = Readable.from(buffer);

      const response = await drive.files.create({
        requestBody: {
          name: file.filename,
          parents: [folderId],
        },
        media: {
          mimeType: file.mimeType,
          body: stream,
        },
        fields: 'id, name, size, webViewLink',
      });

      const fileId = response.data.id;
      if (!fileId) throw new Error('Google Drive upload failed: no file ID returned');

      // Make the file publicly accessible via link
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // Store the Google Drive file ID as the filename so we can reference it later
      file.filename = fileId;
      file.filesize = Number(response.data.size) || file.filesize;
      return file;
    } catch (error) {
      Sentry.captureException(error, {});
      throw error; // Re-throw so Payload does not save the document with the original filename
    }
  },

  async handleDelete({ filename }: Parameters<HandleDelete>[0]) {
    try {
      const drive = getDrive();
      // filename holds the Google Drive file ID
      await drive.files.delete({ fileId: filename });
    } catch (error) {
      Sentry.captureException(error);
    }
  },

  staticHandler() {
    return new Response('Not implemented', { status: 501 });
  },
});

/**
 * Checks whether a string looks like a Google Drive file ID.
 * Drive IDs are alphanumeric strings (with hyphens/underscores), typically 25-60 chars.
 * They never contain dots or spaces (unlike filenames such as "test.xlsx").
 */
function isGoogleDriveFileId(value: string): boolean {
  return /^[a-zA-Z0-9_-]{20,}$/.test(value);
}

/**
 * Generate a direct download URL for a Google Drive file.
 * @param fileId - The Google Drive file ID (stored as filename in Payload)
 */
export async function generateGoogleDriveURL(fileId: string): Promise<string> {
  if (!fileId || !isGoogleDriveFileId(fileId)) {
    Sentry.captureMessage(
      `[Google Drive] Invalid file ID: "${fileId}". ` +
        'This document may have been uploaded before Google Drive was configured, or the upload failed.'
    );
    return '';
  }

  try {
    return `https://drive.google.com/uc?id=${fileId}`;
  } catch (error) {
    Sentry.captureException(error);
    return '';
  }
}
