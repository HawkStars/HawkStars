import type { HandleUpload, HandleDelete } from '@payloadcms/plugin-cloud-storage/types';
import { google } from 'googleapis';
import { Readable } from 'stream';

function getAuth() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  return oauth2Client;
}

function getDrive() {
  return google.drive({ version: 'v3', auth: getAuth() });
}

export const googleDriveAdapter = () => () => ({
  name: 'google-drive-adapter',

  async handleUpload({ file }: Parameters<HandleUpload>[0]) {
    try {
      const drive = getDrive();
      const targetFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

      const buffer = file.buffer instanceof Buffer ? file.buffer : Buffer.from(file.buffer);
      const stream = Readable.from(buffer);

      const response = await drive.files.create({
        requestBody: {
          name: file.filename,
          ...(targetFolderId ? { parents: [targetFolderId] } : {}),
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
    } catch (error) {
      console.error('Google Drive Upload Error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return new Response('Upload failed', { status: 500, statusText: message });
    }
  },

  async handleDelete({ filename }: Parameters<HandleDelete>[0]) {
    try {
      const drive = getDrive();
      // filename holds the Google Drive file ID
      await drive.files.delete({ fileId: filename });
    } catch (error) {
      console.error('Google Drive Delete Error:', error);
    }
  },

  staticHandler() {
    return new Response('Not implemented', { status: 501 });
  },
});

/**
 * Generate a direct download URL for a Google Drive file.
 * @param fileId - The Google Drive file ID (stored as filename in Payload)
 */
export function generateGoogleDriveURL(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}
