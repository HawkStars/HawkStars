import { auth, drive, type drive_v3 } from '@googleapis/drive';

export function getAuth() {
  const oauth2Client = new auth.OAuth2({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  return oauth2Client;
}

/**
 * One Drive client per process. The OAuth2 client caches the access token it gets from the
 * refresh token and renews it only when it expires; building a new client per call (as this
 * used to) forced a token refresh round-trip on every upload, delete and workbook sync.
 */
let driveClient: drive_v3.Drive | undefined;

export function getDrive(): drive_v3.Drive {
  driveClient ??= drive({ version: 'v3', auth: getAuth() });
  return driveClient;
}
