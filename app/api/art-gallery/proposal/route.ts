import * as z from 'zod';
import * as Sentry from '@sentry/nextjs';
import { getPayloadConfig } from '@/lib/payload/server';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';
import { getGallerySettings } from '@/lib/payload/queries/artwork';
import { sendGalleryEmail } from '@/lib/art-gallery/email';
import { ART_CATEGORIES, ArtCategoryValue } from '@/payload/collections/ArtCollection/categories';
import { ARTIST_PROPOSAL_COLLECTION } from '@/payload/collections/ArtistProposal';
import { createNotification } from '@/payload/utilities/collections/createNotification';

const CATEGORY_VALUES = ART_CATEGORIES.map((category) => category.value) as [
  ArtCategoryValue,
  ...ArtCategoryValue[],
];

const proposalSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email(),
  discipline: z.enum(CATEGORY_VALUES),
  portfolio_url: z.url().max(500),
  message: z.string().trim().min(1).max(4000),
  // "Compreendo e aceito…" — the form cannot be sent without it.
  consent: z.literal(true),
});

/** "Sou artista, quero propor obra à curadoria" — saved for review and emailed to the gallery. */
export async function POST(request: Request) {
  const { allowed, retryAfter } = checkRateLimit(`art-proposal:${getClientIp(request)}`, {
    limit: 3,
    windowMs: 10 * 60_000,
  });
  if (!allowed) {
    return Response.json(
      { error: 'too_many_requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  let body: z.infer<typeof proposalSchema>;
  try {
    body = proposalSchema.parse(await request.json());
  } catch {
    return Response.json({ error: 'invalid_request' }, { status: 400 });
  }

  try {
    const payload = await getPayloadConfig();
    const proposal = await payload.create({
      collection: ARTIST_PROPOSAL_COLLECTION,
      data: {
        name: body.name,
        email: body.email,
        discipline: body.discipline,
        portfolio_url: body.portfolio_url,
        message: body.message,
        status: 'new',
      },
    });

    await createNotification(payload, {
      collection: 'artist_proposals',
      situation: 'create',
      title: body.name,
      message: `${body.name} proposed work to the curatorial board.`,
      docId: proposal.id,
    });

    const { contact_email } = await getGallerySettings();
    const discipline = ART_CATEGORIES.find((c) => c.value === body.discipline)?.label.pt;
    await sendGalleryEmail(payload, {
      to: contact_email,
      replyTo: body.email,
      subject: `Nova proposta de artista — ${body.name}`,
      text: [
        `Artista: ${body.name} <${body.email}>`,
        `Categoria: ${discipline}`,
        `Portfólio: ${body.portfolio_url}`,
        '',
        body.message,
      ].join('\n'),
    });

    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    return Response.json({ error: 'internal_error' }, { status: 500 });
  }
}
