import * as Sentry from '@sentry/nextjs';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POSTs JSON and reports whether the server accepted it. */
export async function postJson(url: string, body: unknown): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.ok;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}
