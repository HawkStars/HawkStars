import type { PayloadHandler } from 'payload';
import * as Sentry from '@sentry/nextjs';

/**
 * POST /api/translate
 *
 * Machine-translates plain text between locales to speed up filling in the
 * secondary-locale (EN) fields in the admin. Backed by a (self-hosted)
 * LibreTranslate instance. The result is always a *draft* suggestion an editor
 * reviews — it is never written to the DB by this endpoint.
 *
 * Body: { text: string, from?: string, to?: string }
 *   - from: source locale (default 'pt')
 *   - to:   target locale (default 'en')
 *
 * Requires an authenticated admin user. Uses LIBRETRANSLATE_URL (defaults to
 * http://localhost:5000)
 */
export const translateHandler: PayloadHandler = async (req) => {
  const { user } = req;

  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const baseUrl = (process.env.LIBRETRANSLATE_URL || 'http://localhost:5000').replace(/\/+$/, '');

  try {
    const body = (await req.json?.()) as
      { text?: unknown; from?: unknown; to?: unknown } | undefined;

    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    const source = typeof body?.from === 'string' && body.from ? body.from : 'pt';
    const target = typeof body?.to === 'string' && body.to ? body.to : 'en';

    if (!text) {
      return Response.json({ error: 'Provide non-empty { text }.' }, { status: 400 });
    }

    // Guard against oversized requests.
    if (text.length > 20000) {
      return Response.json({ error: 'Text too long to translate.' }, { status: 413 });
    }

    const res = await fetch(`${baseUrl}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source,
        target,
        format: 'text',
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      Sentry.captureException(new Error(`LibreTranslate API error ${res.status}: ${detail}`));
      return Response.json({ error: 'Translation service failed.' }, { status: 502 });
    }

    const data = (await res.json()) as { translatedText?: string };

    const translation = data?.translatedText;
    if (typeof translation !== 'string') {
      return Response.json({ error: 'No translation returned.' }, { status: 502 });
    }

    return Response.json({ translation });
  } catch (err) {
    Sentry.captureException(err);
    return Response.json({ error: 'Failed to translate.' }, { status: 500 });
  }
};

export default translateHandler;
