import { NextResponse, type NextRequest } from 'next/server';
import { google } from 'googleapis';
import { getPayloadConfig } from '@/lib/payload/server';
import * as Sentry from '@sentry/nextjs';

/**
 * Google OAuth2 callback endpoint.
 *
 * After the user authorises access in the Google consent screen, Google
 * redirects here with an authorisation `code` query parameter. This handler
 * exchanges that code for an access token and a refresh token, then persists
 * the refresh token in the Payload Website Settings global so that the
 * Google Drive adapter (and any other Google integration) can use it for
 * long-lived, offline access.
 *
 * Flow:
 *   1. Admin visits the Google consent URL (with access_type=offline).
 *   2. Google redirects to this endpoint with ?code=…
 *   3. We exchange the code for tokens via the Google OAuth2 client.
 *   4. The refresh token is saved to Payload Website Settings.
 *
 * Required environment variables:
 *   - GOOGLE_CLIENT_ID
 *   - GOOGLE_CLIENT_SECRET
 *   - GOOGLE_REDIRECT_URI  (must point to this route)
 */

function getOAuth2Client() {
  return new google.auth.OAuth2({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Google may redirect with an error (e.g. user denied consent)
  if (error) {
    Sentry.captureMessage(`Google OAuth2 callback error: ${error}`, {
      level: 'warning',
    });

    return NextResponse.json({ error: `Google authorisation failed: ${error}` }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorisation code. Please start the OAuth flow again.' },
      { status: 400 }
    );
  }

  try {
    const oauth2Client = getOAuth2Client();

    // Exchange the authorisation code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      Sentry.captureMessage(
        'Google OAuth2 token exchange succeeded but no refresh_token was returned. ' +
          'Ensure "access_type=offline" and "prompt=consent" are set in the consent URL.',
        { level: 'warning' }
      );

      return NextResponse.json(
        {
          error:
            'No refresh token received. You may need to revoke access and re-authorise with prompt=consent.',
        },
        { status: 400 }
      );
    }

    // Persist the refresh token in Payload Website Settings
    const payload = await getPayloadConfig();

    await payload.updateGlobal({
      slug: 'settings',
      data: { googleRefreshToken: tokens.refresh_token },
    });

    payload.logger.info('Google refresh token stored successfully in Website Settings.');

    return NextResponse.json({
      success: true,
      message: 'Google refresh token saved successfully.',
    });
  } catch (err) {
    Sentry.captureException(err);

    return NextResponse.json(
      {
        error: 'Failed to exchange authorisation code for tokens.',
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
