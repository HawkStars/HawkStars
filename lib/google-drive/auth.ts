import { auth, drive } from '@googleapis/drive';

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

export function getDrive() {
  return drive({ version: 'v3', auth: getAuth() });
}
