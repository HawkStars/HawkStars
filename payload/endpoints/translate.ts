import type { PayloadHandler } from 'payload';

/**
 * POST /api/translate
 *
 * Machine-translates plain text between locales to speed up filling in the
 * secondary-locale (EN) fields in the admin. Backed by the Google Cloud
 * Translation API v2. The result is always a *draft* suggestion an editor
 * reviews — it is never written to the DB by this endpoint.
 *
 * Body: { text: string, from?: string, to?: string }
 *   - from: source locale (default 'pt')
 *   - to:   target locale (default 'en')
 *
 * Requires an authenticated admin user and the GOOGLE_TRANSLATE_API_KEY env var.
 */
export const translateHandler: PayloadHandler = async (req) => {
  const { user, payload } = req;

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'Translation is not configured (missing GOOGLE_TRANSLATE_API_KEY).' },
      { status: 503 }
    );
  }

  try {
    const body = (await req.json?.()) as
      | { text?: unknown; from?: unknown; to?: unknown }
      | undefined;

    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    const source = typeof body?.from === 'string' && body.from ? body.from : 'pt';
    const target = typeof body?.to === 'string' && body.to ? body.to : 'en';

    if (!text) {
      return Response.json({ error: 'Provide non-empty { text }.' }, { status: 400 });
    }

    // Guard against oversized requests (Google caps at ~30k chars/request).
    if (text.length > 20000) {
      return Response.json({ error: 'Text too long to translate.' }, { status: 413 });
    }

    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source,
          target,
          format: 'text',
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      payload.logger.error(`Google Translate API error ${res.status}: ${detail}`);
      return Response.json({ error: 'Translation service failed.' }, { status: 502 });
    }

    const data = (await res.json()) as {
      data?: { translations?: Array<{ translatedText?: string }> };
    };

    const translation = data?.data?.translations?.[0]?.translatedText;
    if (typeof translation !== 'string') {
      return Response.json({ error: 'No translation returned.' }, { status: 502 });
    }

    return Response.json({ translation });
  } catch (err) {
    payload.logger.error(`Translate endpoint error: ${(err as Error)?.message}`);
    return Response.json({ error: 'Failed to translate.' }, { status: 500 });
  }
};

export default translateHandler;
