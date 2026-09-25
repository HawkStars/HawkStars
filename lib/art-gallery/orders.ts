import { timingSafeEqual } from 'crypto';
import * as Sentry from '@sentry/nextjs';
import type { BasePayload } from 'payload';
import type { ArtOrder, Artwork } from '@/payload-types';
import { ART_ORDER_COLLECTION, ArtOrderStatus } from '@/payload/collections/ArtOrder';
import { createNotification } from '@/payload/utilities/collections/createNotification';
import { ART_GALLERY_SETTINGS_SLUG } from '@/payload/globals/ArtGallerySettings/config';
import { SinglePaymentMethod } from '@/types/payment/easypay';
import { EasyPayPaymentStatus, getSinglePayment } from './easypay';
import { sendGalleryEmail } from './email';

/**
 * How long a pending order holds one copy of the artwork. Multibanco matches
 * the reference's own expiry (sent to EasyPay); MB WAY requests and card
 * sessions are short-lived.
 */
export const RESERVATION_MINUTES: Record<SinglePaymentMethod, number> = {
  MB: 48 * 60,
  MBW: 10,
  CC: 30,
};

const DEFAULT_GALLERY_EMAIL = 'artgallery.socialimpact@gmail.com';

/** Don't ask EasyPay about the same order more than once per this interval. */
const SYNC_THROTTLE_MS = 10_000;

export const reservationEnd = (method: SinglePaymentMethod, from = new Date()) =>
  new Date(from.getTime() + RESERVATION_MINUTES[method] * 60_000);

/** EasyPay's `payment_status` → what it means for the order. */
export function orderOutcome(status: EasyPayPaymentStatus): 'paid' | 'failed' | 'pending' {
  if (status === 'paid') return 'paid';
  if (status === 'failed' || status === 'error' || status === 'deleted') return 'failed';
  // pending / active / authorised (not yet captured)
  return 'pending';
}

/** Copies still free to sell: remaining copies minus those held by unexpired pending orders. */
export const freeCopies = (
  artwork: Pick<Artwork, 'available_quantity' | 'edition_size'>,
  reserved: number
) => Math.max(0, (artwork.available_quantity ?? artwork.edition_size ?? 1) - reserved);

/** Copies held by unexpired pending orders (optionally only those created before `createdBefore`). */
export async function countReservedCopies(
  payload: BasePayload,
  artworkId: string,
  now = new Date(),
  createdBefore?: string
) {
  const { totalDocs } = await payload.count({
    collection: ART_ORDER_COLLECTION,
    where: {
      artwork: { equals: artworkId },
      status: { equals: 'pending' },
      reserved_until: { greater_than: now.toISOString() },
      ...(createdBefore ? { createdAt: { less_than: createdBefore } } : {}),
    },
  });
  return totalDocs;
}

/** The buyer's order, only if the secret token from their order link matches. */
export async function findOrderForBuyer(payload: BasePayload, reference: string, token: string) {
  const { docs } = await payload.find({
    collection: ART_ORDER_COLLECTION,
    where: { reference: { equals: reference } },
    limit: 1,
    depth: 1,
    showHiddenFields: true,
  });
  const order = docs[0];
  if (!order?.access_token || !token) return null;

  const expected = Buffer.from(order.access_token);
  const provided = Buffer.from(token);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;
  return order;
}

type OrdersModel = {
  updateOne: (filter: object, update: object) => Promise<{ modifiedCount: number }>;
};

/**
 * Status changes go through a conditional Mongo update so that two sources
 * confirming the same payment at once (webhook + the buyer's order page) can
 * only apply it once — only the first one gets `modifiedCount === 1`.
 */
const ordersModel = (payload: BasePayload) =>
  (payload.db as unknown as { collections: Record<string, OrdersModel> }).collections[
    ART_ORDER_COLLECTION
  ];

async function claimStatus(
  payload: BasePayload,
  orderId: string,
  from: { $in: ArtOrderStatus[] } | { $ne: ArtOrderStatus },
  set: Record<string, unknown>
) {
  const { modifiedCount } = await ordersModel(payload).updateOne(
    { _id: orderId, status: from },
    { $set: { ...set, updatedAt: new Date() } }
  );
  return modifiedCount === 1;
}

const relationId = (value: string | { id: string }) =>
  typeof value === 'string' ? value : value.id;

async function markOrderPaid(payload: BasePayload, order: ArtOrder, paidAt: Date) {
  // A late payment (after expiry/cancellation) is still money received: record it.
  const claimed = await claimStatus(
    payload,
    order.id,
    { $ne: 'paid' },
    { status: 'paid', paid_at: paidAt }
  );
  if (!claimed) return;

  const artworkId = relationId(order.artwork);
  const artwork = await payload.findByID({ collection: 'artworks', id: artworkId, depth: 0 });
  const remaining = Math.max(0, (artwork.available_quantity ?? artwork.edition_size ?? 1) - 1);
  // One copy fewer; the artwork's `syncEditions` hook marks it sold out at 0.
  await payload.update({
    collection: 'artworks',
    id: artworkId,
    data: { available_quantity: remaining },
  });

  const late = order.status !== 'pending' ? ` (paid after the order was ${order.status})` : '';
  await createNotification(payload, {
    collection: 'art_orders',
    situation: 'update',
    title: order.reference,
    message: `Payment received for order ${order.reference} — €${order.total}${late}.`,
    docId: order.id,
  });
  await sendPaidEmails(payload, order, artwork, remaining);
}

async function closeOrder(payload: BasePayload, order: ArtOrder, status: 'failed' | 'expired') {
  const closed = await claimStatus(payload, order.id, { $in: ['pending'] }, { status });
  if (!closed) return;
  await createNotification(payload, {
    collection: 'art_orders',
    situation: 'update',
    title: order.reference,
    message:
      status === 'expired'
        ? `Order ${order.reference} expired without payment — the copy is available again.`
        : `Payment failed for order ${order.reference} — the copy is available again.`,
    docId: order.id,
  });
}

/**
 * Brings a pending order in line with EasyPay: asks for the payment's real
 * status (never trusting a notification's payload or the browser) and marks
 * the order paid, failed, or — once its reservation is over — expired.
 * Safe to call repeatedly and concurrently. Returns the up-to-date order.
 */
export async function syncArtOrder(
  payload: BasePayload,
  order: ArtOrder,
  { force = false, now = new Date() }: { force?: boolean; now?: Date } = {}
): Promise<ArtOrder> {
  if (order.status !== 'pending') return order;

  const lastChecked = order.last_checked_at ? new Date(order.last_checked_at).getTime() : 0;
  if (!force && now.getTime() - lastChecked < SYNC_THROTTLE_MS) return order;
  await ordersModel(payload).updateOne({ _id: order.id }, { $set: { last_checked_at: now } });

  try {
    if (order.easypay_id) {
      const payment = await getSinglePayment(order.easypay_id);
      const outcome = orderOutcome(payment.payment_status);
      if (outcome === 'paid') {
        await markOrderPaid(payload, order, payment.paid_at ? new Date(payment.paid_at) : now);
      } else if (outcome === 'failed') {
        await closeOrder(payload, order, 'failed');
      }
    }
  } catch (error) {
    // EasyPay unreachable: leave the order as is — the next check retries.
    Sentry.captureException(error);
    return order;
  }

  const refreshed = await payload.findByID({
    collection: ART_ORDER_COLLECTION,
    id: order.id,
    depth: 1,
  });
  const reservationOver =
    refreshed.reserved_until && new Date(refreshed.reserved_until).getTime() <= now.getTime();
  if (refreshed.status === 'pending' && reservationOver) {
    await closeOrder(payload, refreshed, 'expired');
    return payload.findByID({ collection: ART_ORDER_COLLECTION, id: order.id, depth: 1 });
  }
  return refreshed;
}

/**
 * EasyPay webhook entry point: returns `false` when the transaction key is not
 * an artwork order (so the webhook treats it as a donation). The notification
 * only tells us *which* order to re-check — its content is not trusted.
 */
export async function handleArtOrderNotification(payload: BasePayload, transactionKey: string) {
  const { docs } = await payload.find({
    collection: ART_ORDER_COLLECTION,
    where: { transaction_key: { equals: transactionKey } },
    limit: 1,
    depth: 1,
  });
  const order = docs[0];
  if (!order) return false;

  await syncArtOrder(payload, order, { force: true });
  return true;
}

/** Scheduled clean-up: re-checks pending orders whose reservation is over (see payload/jobs). */
export async function expireOverdueArtOrders(payload: BasePayload, now = new Date()) {
  const { docs } = await payload.find({
    collection: ART_ORDER_COLLECTION,
    where: {
      status: { equals: 'pending' },
      reserved_until: { less_than_equal: now.toISOString() },
    },
    limit: 100,
    depth: 1,
  });
  for (const order of docs) await syncArtOrder(payload, order, { force: true, now });
  return docs.length;
}

/* ------------------------------------------------------------------ */
/*  Emails (Portuguese — the gallery's working language)              */
/* ------------------------------------------------------------------ */

const artworkTitle = (artwork: ArtOrder['artwork']) =>
  typeof artwork === 'string' ? '' : artwork.title;

const deliveryText = (order: ArtOrder) =>
  order.delivery === 'pickup'
    ? 'Recolha na morada do artista'
    : 'Transportadora (portes cotados e pagos à parte)';

export async function sendOrderCreatedEmails(
  payload: BasePayload,
  order: ArtOrder,
  { orderUrl, galleryEmail }: { orderUrl: string; galleryEmail: string }
) {
  const title = artworkTitle(order.artwork);
  const summary = [
    `Obra: ${title} (${order.artwork_reference ?? ''})`,
    `Total: € ${order.total} (base € ${order.base_value} + IVA ${order.vat_rate}% € ${order.vat_value})`,
    `Pagamento: ${order.payment_method}`,
    `Entrega: ${deliveryText(order)}`,
  ];
  const reservedUntil = order.reserved_until
    ? new Date(order.reserved_until).toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })
    : '';

  await sendGalleryEmail(payload, {
    to: order.buyer.email,
    replyTo: galleryEmail,
    subject: `Encomenda ${order.reference} registada — ${title}`,
    text: [
      `Olá ${order.buyer.name},`,
      '',
      `A sua encomenda ${order.reference} foi registada. A obra fica reservada para si até ${reservedUntil}.`,
      '',
      ...summary,
      '',
      `Instruções de pagamento e estado da encomenda: ${orderUrl}`,
      '',
      'Galeria de Arte Impacto Social — Hawk Stars NGO',
    ].join('\n'),
  });

  await sendGalleryEmail(payload, {
    to: galleryEmail,
    replyTo: order.buyer.email,
    subject: `Nova encomenda ${order.reference} (a aguardar pagamento) — ${title}`,
    text: [
      ...summary,
      '',
      `Comprador: ${order.buyer.name}${order.buyer.nif ? ` — NIF ${order.buyer.nif}` : ''}`,
      `Email: ${order.buyer.email}`,
      `Telefone: ${order.buyer.phone || '—'}`,
      `Morada: ${order.buyer.address}, ${order.buyer.postal_code_city}`,
    ].join('\n'),
  });
}

async function sendPaidEmails(
  payload: BasePayload,
  order: ArtOrder,
  artwork: Artwork,
  remaining: number
) {
  // Read through the given Payload instance (not the site queries), so this
  // also works from the scheduled job outside Next.
  const settings = await payload
    .findGlobal({ slug: ART_GALLERY_SETTINGS_SLUG, depth: 0 })
    .catch(() => null);
  const contact_email = settings?.contact_email || DEFAULT_GALLERY_EMAIL;

  await sendGalleryEmail(payload, {
    to: order.buyer.email,
    replyTo: contact_email,
    subject: `Pagamento confirmado — encomenda ${order.reference}`,
    text: [
      `Olá ${order.buyer.name},`,
      '',
      `Recebemos o pagamento de € ${order.total} da encomenda ${order.reference} (${artwork.title}). Obrigado!`,
      order.delivery === 'pickup'
        ? 'Vamos contactá-lo para combinar a recolha na morada do artista.'
        : 'Vamos enviar-lhe a cotação dos portes de envio para concluir a entrega.',
      '',
      'Galeria de Arte Impacto Social — Hawk Stars NGO',
    ].join('\n'),
  });

  await sendGalleryEmail(payload, {
    to: contact_email,
    replyTo: order.buyer.email,
    subject: `PAGA: encomenda ${order.reference} — ${artwork.title}`,
    text: [
      `Pagamento de € ${order.total} confirmado pela EasyPay.`,
      `Obra: ${artwork.title} (${artwork.reference}) — exemplares restantes: ${remaining}`,
      `Comprador: ${order.buyer.name} <${order.buyer.email}>`,
      `Entrega: ${deliveryText(order)}`,
    ].join('\n'),
  });
}

/** What the buyer's order page may see — no buyer data, no internal fields. */
export type PublicArtOrder = {
  reference: string;
  status: ArtOrder['status'];
  paymentMethod: ArtOrder['payment_method'];
  total: number;
  reservedUntil: string | null;
  payment: { entity?: string; reference?: string; url?: string };
};

export function toPublicOrder(order: ArtOrder): PublicArtOrder {
  const method = (order.easypay_response as { method?: PublicArtOrder['payment'] } | null)?.method;
  return {
    reference: order.reference,
    status: order.status,
    paymentMethod: order.payment_method,
    total: order.total,
    reservedUntil: order.reserved_until ?? null,
    payment: {
      entity: method?.entity != null ? String(method.entity) : undefined,
      reference: method?.reference,
      url: method?.url,
    },
  };
}
