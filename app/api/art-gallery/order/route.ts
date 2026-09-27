import * as z from 'zod';
import * as Sentry from '@sentry/nextjs';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { getPayloadConfig } from '@/lib/payload/server';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';
import { captureSentryMessage } from '@/lib/sentry/logs';
import { BASE_URL } from '@/lib/constants';
import { languages } from '@/i18n/settings';
import { getGallerySettings } from '@/lib/payload/queries/artwork';
import { artworkPrice, computeArtworkTotals, isPurchasable } from '@/lib/art-gallery/pricing';
import { EasyPayError, createSinglePayment, toEasyPayDateTime } from '@/lib/art-gallery/easypay';
import {
  countReservedCopies,
  freeCopies,
  reservationEnd,
  sendOrderCreatedEmails,
} from '@/lib/art-gallery/orders';
import { ART_ORDER_COLLECTION } from '@/payload/collections/ArtOrder';
import { createNotification } from '@/payload/utilities/collections/createNotification';

const orderSchema = z
  .object({
    artworkId: z.string().min(1).max(64),
    lng: z.enum(languages).default('pt'),
    delivery: z.enum(['pickup', 'carrier']),
    paymentType: z.enum(['CC', 'MB', 'MBW']),
    name: z.string().trim().min(1).max(120),
    nif: z.string().trim().max(20).optional(),
    email: z.email(),
    phone_number: z.string().trim().max(20).optional(),
    phone_indicative: z.string().trim().max(6).optional(),
    address: z.string().trim().min(1).max(200),
    postal_code_city: z.string().trim().min(1).max(120),
  })
  // MB WAY sends the payment request to the buyer's phone.
  .refine((body) => body.paymentType !== 'MBW' || !!body.phone_number, {
    path: ['phone_number'],
  });

const digits = (value?: string) => value?.replace(/\D/g, '') ?? '';

/** "+351" + "912 345 678" → "+351912345678" (E.164, as MB WAY expects). */
const e164 = (indicative?: string, phone?: string) =>
  `+${digits(indicative) || '351'}${digits(phone)}`;

/**
 * Starts an online artwork purchase:
 * 1. re-reads the artwork and gallery settings server side (the browser only
 *    says *which* artwork, never the price);
 * 2. reserves one copy by creating the pending order first, then re-counts the
 *    reservations — if two buyers raced for the last copy, the later one backs
 *    out before any payment exists;
 * 3. creates the EasyPay payment (a Multibanco reference expires together with
 *    the reservation) and returns the buyer's private order page.
 * The order is then confirmed by `syncArtOrder` (webhook, order page, job).
 */
export async function POST(request: Request) {
  const { allowed, retryAfter } = checkRateLimit(`art-order:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (!allowed) {
    return Response.json(
      { error: 'too_many_requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  let body: z.infer<typeof orderSchema>;
  try {
    body = orderSchema.parse(await request.json());
  } catch {
    return Response.json({ error: 'invalid_request' }, { status: 400 });
  }

  const payload = await getPayloadConfig();
  let orderId: string | null = null;

  try {
    const artwork = await payload
      .findByID({ collection: 'artworks', id: body.artworkId, depth: 1, locale: 'pt' })
      .catch(() => null);
    if (!artwork) return Response.json({ error: 'not_found' }, { status: 404 });

    const now = new Date();
    const reservedBefore = await countReservedCopies(payload, artwork.id, now);
    if (!isPurchasable(artwork) || freeCopies(artwork, reservedBefore) < 1) {
      return Response.json({ error: 'unavailable' }, { status: 409 });
    }

    const settings = await getGallerySettings();
    const totals = computeArtworkTotals(artworkPrice(artwork)!, settings.vat_rate);
    const transactionKey = uuidv4();
    const reference = `ENC-${transactionKey.slice(0, 8).toUpperCase()}`;
    const accessToken = randomBytes(24).toString('base64url');
    const reservedUntil = reservationEnd(body.paymentType, now);

    // 1. Reserve one copy.
    const order = await payload.create({
      collection: ART_ORDER_COLLECTION,
      data: {
        reference,
        status: 'pending',
        artwork: artwork.id,
        artwork_reference: artwork.reference,
        delivery: body.delivery,
        buyer: {
          name: body.name,
          nif: body.nif,
          email: body.email,
          phone: body.phone_number ? e164(body.phone_indicative, body.phone_number) : undefined,
          address: body.address,
          postal_code_city: body.postal_code_city,
        },
        base_value: totals.base,
        vat_rate: totals.vatRate,
        vat_value: totals.vat,
        total: totals.total,
        payment_method: body.paymentType,
        transaction_key: transactionKey,
        reserved_until: reservedUntil.toISOString(),
        access_token: accessToken,
      },
    });
    orderId = order.id;

    // 2. Did an earlier buyer reserve the last copy at the same moment? Only
    //    the later of two racing orders backs out.
    const reservedEarlier = await countReservedCopies(payload, artwork.id, now, order.createdAt);
    if (freeCopies(artwork, reservedEarlier) < 1) {
      await payload.update({
        collection: ART_ORDER_COLLECTION,
        id: order.id,
        data: {
          status: 'cancelled',
          notes:
            'Cancelada automaticamente: outro comprador reservou o último exemplar ao mesmo tempo.',
        },
      });
      orderId = null;
      return Response.json({ error: 'unavailable' }, { status: 409 });
    }

    // 3. Create the payment.
    const payment = await createSinglePayment({
      type: 'sale',
      key: transactionKey,
      value: totals.total,
      currency: 'EUR',
      method: body.paymentType,
      customer: {
        name: body.name,
        email: body.email,
        phone: digits(body.phone_number) || undefined,
        phone_indicative: body.phone_number
          ? `+${digits(body.phone_indicative) || '351'}`
          : undefined,
        fiscal_number: body.nif ? `PT${digits(body.nif)}` : undefined,
        key: body.email,
        language: body.lng === 'en' ? 'EN' : 'PT',
      },
      capture: {
        descriptive: `Galeria de Arte ${reference}`,
        transaction_key: transactionKey,
      },
      ...(body.paymentType === 'MB'
        ? { multibanco: { expiration_time: toEasyPayDateTime(reservedUntil) } }
        : {}),
      notification: { customer_method_instructions_email: true },
    });

    const savedOrder = await payload.update({
      collection: ART_ORDER_COLLECTION,
      id: order.id,
      data: { easypay_id: payment.id, easypay_response: payment },
      depth: 1,
    });

    const orderPath = `/${body.lng}/art/order/${reference}?token=${accessToken}`;
    await createNotification(payload, {
      collection: 'art_orders',
      situation: 'create',
      title: reference,
      message: `${body.name} started the purchase of "${artwork.title}" (${artwork.reference}) — €${totals.total}, ${body.paymentType}.`,
      docId: order.id,
    });
    await sendOrderCreatedEmails(payload, savedOrder, {
      orderUrl: `${BASE_URL}${orderPath}`,
      galleryEmail: settings.contact_email,
    });

    return Response.json({ order: reference, orderUrl: orderPath }, { status: 200 });
  } catch (error) {
    // No payment could be created: release the reservation straight away.
    if (orderId) {
      await payload
        .update({
          collection: ART_ORDER_COLLECTION,
          id: orderId,
          data: {
            status: 'cancelled',
            notes: 'Cancelada automaticamente: o pagamento não pôde ser criado.',
          },
        })
        .catch((releaseError) => Sentry.captureException(releaseError));
    }
    if (error instanceof EasyPayError) {
      captureSentryMessage('EasyPay artwork payment error:', 'info', {
        status: error.status,
        text: error.body,
      });
      return Response.json({ error: 'payment_failed' }, { status: 502 });
    }
    Sentry.captureException(error);
    return Response.json({ error: 'internal_error' }, { status: 500 });
  }
}
