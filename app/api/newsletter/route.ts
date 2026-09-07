import { getPayloadConfig } from '@/lib/payload/server';
import * as Sentry from '@sentry/nextjs';
import * as z from 'zod';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';

const subscriptionSchema = z.object({
  email: z.email(),
  locale: z.enum(['pt', 'en']).optional(),
});

// Mongo's duplicate-key error for the `email` unique index. Re-subscribing
// with an email that's already on the list should look identical to the
// caller as a fresh signup — surfacing "this email is already subscribed"
// would let a caller enumerate which addresses have signed up.
const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: number }).code === 11000;

export async function POST(request: Request) {
  const { allowed, retryAfter } = checkRateLimit(`newsletter:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (!allowed) {
    return Response.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return Response.json({ error: 'Missing request body' }, { status: 400 });
    }

    const data = subscriptionSchema.parse(body);
    const payload = await getPayloadConfig();

    try {
      await payload.create({
        collection: 'newsletter_subscribers',
        data: {
          email: data.email,
          locale: data.locale,
        },
        // Force public-submission context regardless of any session, same
        // pattern as /api/member-projects.
        overrideAccess: true,
      });
    } catch (createError: unknown) {
      if (!isDuplicateKeyError(createError)) throw createError;
    }

    return Response.json({ success: true }, { status: 201 });
  } catch (e: unknown) {
    Sentry.captureException(e);
    if (e instanceof z.ZodError) {
      return Response.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
