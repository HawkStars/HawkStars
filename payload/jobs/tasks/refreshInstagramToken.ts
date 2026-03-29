import type { TaskConfig } from 'payload';

const INSTAGRAM_API_BASE = 'https://graph.instagram.com';

type RefreshTokenTaskIO = {
  input: Record<string, never>;
  output: Record<string, never>;
};

/**
 * Payload task to refresh the Instagram long-lived access token.
 *
 * Instagram long-lived tokens are valid for 60 days and can be refreshed if they
 * have at least 24 hours remaining. This task calls the refresh endpoint and
 * stores the new token in the WebsiteSettings global so the Instagram feed
 * stays active without manual intervention.
 *
 * Runs twice a week (Monday and Thursday at 03:00 UTC).
 *
 * @see https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token/
 */
export const refreshInstagramTokenTask: TaskConfig<RefreshTokenTaskIO> = {
  slug: 'refreshInstagramToken',
  label: 'Refresh Instagram Access Token',
  handler: async ({ req }) => {
    const { payload } = req;

    // Read the current token from the settings global, falling back to the env var
    const settings = await payload.findGlobal({ slug: 'settings' });
    const currentToken = settings?.instagramToken ?? process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!currentToken) {
      throw new Error(
        'No Instagram access token found. Set instagramToken in Website Settings or the INSTAGRAM_ACCESS_TOKEN environment variable.'
      );
    }

    // The Instagram refresh endpoint only supports GET with the token as a query
    // parameter – this is the documented approach from Meta/Facebook.
    // See: https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token/
    const url = `${INSTAGRAM_API_BASE}/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;

    const response = await fetch(url);

    let data: {
      access_token?: string;
      token_type?: string;
      expires_in?: number;
      error?: { message?: string };
    };
    try {
      data = await response.json();
    } catch {
      throw new Error(
        `Failed to parse Instagram refresh response (status ${response.status}): response was not valid JSON`
      );
    }

    if (!response.ok || data.error) {
      const message = data.error?.message ?? `Instagram API returned status ${response.status}`;
      throw new Error(`Failed to refresh Instagram access token: ${message}`);
    }

    const newToken = data.access_token;

    if (!newToken) {
      throw new Error('Instagram refresh response did not include an access_token');
    }

    await payload.updateGlobal({
      slug: 'settings',
      data: { instagramToken: newToken },
    });

    payload.logger.info(
      `Instagram access token refreshed successfully. Expires in ${data.expires_in} seconds.`
    );

    return { output: {} };
  },
  schedule: [
    {
      // Twice a week: Monday and Thursday at 03:00 UTC
      cron: '0 3 * * 1,4',
      queue: 'default',
    },
  ],
};
