'use server';

const scopes = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
] as const;

const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth` as const;
const REDIRECT_URI =
  `${process.env.GOOGLE_REDIRECT_URI ?? `${process.env.NEXT_PUBLIC_BASE_URL}/api/google/refresh-token`}` as const;

export const handleRefreshToken = async () => {
  try {
    const response = await fetch(GOOGLE_AUTH_URL, {
      method: 'POST',
      headers: {
        access_type: 'offline',
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: scopes.join(' '),
        prompt: 'consent',
      },
    } as RequestInit);

    if (response.ok) {
      const data = await response.body?.getReader().read();
      console.log(data);
      console.log('Google refresh token updated successfully!');
    } else {
      console.log('Failed to update Google refresh token.');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    console.log('An error occurred while refreshing the token.');
  }
};
