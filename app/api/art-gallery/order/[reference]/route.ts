import * as Sentry from '@sentry/nextjs';
import { getPayloadConfig } from '@/lib/payload/server';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';
import { findOrderForBuyer, syncArtOrder, toPublicOrder } from '@/lib/art-gallery/orders';

/**
 * Status of one order for the buyer's order page (polled while it is pending).
 * Needs the secret token from the order link; re-checks the payment with
 * EasyPay (throttled in `syncArtOrder`), so the page updates even if the
 * webhook is delayed or never arrives.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { allowed, retryAfter } = checkRateLimit(`art-order-status:${getClientIp(request)}`, {
    limit: 60,
    windowMs: 60_000,
  });
  if (!allowed) {
    return Response.json(
      { error: 'too_many_requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  const { reference } = await params;
  const token = new URL(request.url).searchParams.get('token') ?? '';

  try {
    const payload = await getPayloadConfig();
    const order = await findOrderForBuyer(payload, reference, token);
    if (!order) return Response.json({ error: 'not_found' }, { status: 404 });

    const current = await syncArtOrder(payload, order);
    return Response.json(toPublicOrder(current), {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    Sentry.captureException(error);
    return Response.json({ error: 'internal_error' }, { status: 500 });
  }
}
