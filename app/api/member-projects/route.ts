import { getPayloadConfig } from '@/lib/payload/server';
import * as Sentry from '@sentry/nextjs';
import * as z from 'zod';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';
import { isHttpUrl } from '@/utils/paths';

const optionalUrl = z
  .url('Must be a valid URL')
  .refine(isHttpUrl, 'URL must start with http:// or https://')
  .optional()
  .or(z.literal('').transform(() => undefined));

const submissionSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    description: z.string().trim().min(1, 'Description is required').max(5000),
    language: z.enum(['pt', 'en', 'es', 'fr', 'de', 'it', 'other']),
    image_url: optionalUrl,
    video_url: optionalUrl,
    dates: z
      .array(
        z.object({
          label: z.string().trim().min(1, 'Each date needs a label'),
          date: z.string().min(1, 'Each entry needs a date'),
          link: optionalUrl,
        })
      )
      .max(20)
      .optional()
      .default([]),
    submitter_name: z.string().trim().min(1, 'Your name is required').max(120),
    submitter_email: z.email(),
  })
  .refine((data) => Boolean(data.image_url) || Boolean(data.video_url), {
    message: 'Provide at least an image URL or a video URL',
    path: ['image_url'],
  });

export async function POST(request: Request) {
  const { allowed, retryAfter } = checkRateLimit(`member-projects:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (!allowed) {
    return Response.json(
      { error: 'Too many submissions. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return Response.json({ error: 'Missing request body' }, { status: 400 });
    }

    const data = submissionSchema.parse(body);

    const payload = await getPayloadConfig();

    await payload.create({
      collection: 'member_projects',
      data: {
        title: data.title,
        description: data.description,
        language: data.language,
        image_url: data.image_url ?? null,
        video_url: data.video_url ?? null,
        dates: data.dates?.map((d) => ({
          label: d.label,
          date: d.date,
          link: d.link ?? null,
        })),
        submitter: {
          submitter_name: data.submitter_name,
          submitter_email: data.submitter_email,
        },
        // Always unconfirmed on submission — an admin must verify membership.
        is_confirmed: false,
      },
      // Force public-submission context regardless of any session.
      overrideAccess: true,
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return Response.json({ error: 'Invalid submission', details: e.issues }, { status: 400 });
    }
    Sentry.captureException(e);
    console.error('Member project submission error:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
