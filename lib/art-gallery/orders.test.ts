import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BasePayload } from 'payload';
import type { ArtOrder, Artwork } from '@/payload-types';

const { mockGetSinglePayment, mockSendEmail } = vi.hoisted(() => ({
  mockGetSinglePayment: vi.fn(),
  mockSendEmail: vi.fn(),
}));

vi.mock('./easypay', () => ({ getSinglePayment: mockGetSinglePayment }));
vi.mock('./email', () => ({ sendGalleryEmail: mockSendEmail }));
vi.mock('@/payload/utilities/collections/createNotification', () => ({
  createNotification: vi.fn(),
}));
vi.mock('@sentry/nextjs', () => ({ captureException: vi.fn() }));
vi.mock('@/payload/globals/ArtGallerySettings/config', () => ({
  ART_GALLERY_SETTINGS_SLUG: 'artGallerySettings',
}));
vi.mock('@/payload/collections/ArtOrder', () => ({ ART_ORDER_COLLECTION: 'art_orders' }));

import {
  freeCopies,
  orderOutcome,
  reservationEnd,
  sendOrderCreatedEmails,
  syncArtOrder,
} from './orders';

const NOW = new Date('2026-09-23T12:00:00Z');

/** Minimal in-memory Payload: one order, one artwork, and Mongo-style conditional updates. */
function fakePayload(order: Partial<ArtOrder>, artwork: Partial<Artwork>) {
  const orders: Record<string, ArtOrder> = { [order.id!]: order as ArtOrder };
  const artworks: Record<string, Artwork> = { [artwork.id!]: artwork as Artwork };

  const matches = (doc: ArtOrder, status?: { $ne?: string; $in?: string[] }) =>
    !status ||
    (status.$ne !== undefined ? doc.status !== status.$ne : status.$in!.includes(doc.status));

  const payload = {
    db: {
      collections: {
        art_orders: {
          updateOne: vi.fn(
            async (
              filter: { _id: string; status?: { $ne?: string; $in?: string[] } },
              update: { $set: Partial<ArtOrder> }
            ) => {
              const doc = orders[filter._id];
              if (!doc || !matches(doc, filter.status)) return { modifiedCount: 0 };
              Object.assign(doc, update.$set);
              return { modifiedCount: 1 };
            }
          ),
        },
      },
    },
    findByID: vi.fn(async ({ collection, id }: { collection: string; id: string }) =>
      structuredClone(collection === 'artworks' ? artworks[id] : orders[id])
    ),
    update: vi.fn(async ({ id, data }: { id: string; data: Partial<Artwork> }) => {
      Object.assign(artworks[id], data);
      return artworks[id];
    }),
    findGlobal: vi.fn(async () => ({ contact_email: 'gallery@example.com' })),
  };

  return { payload: payload as unknown as BasePayload, orders, artworks };
}

const baseOrder = (overrides: Partial<ArtOrder> = {}): Partial<ArtOrder> => ({
  id: 'order-1',
  reference: 'ENC-TEST',
  status: 'pending',
  artwork: 'art-1',
  easypay_id: 'ep-1',
  total: 123,
  delivery: 'pickup',
  buyer: { name: 'Ana', email: 'ana@example.com' },
  reserved_until: new Date(NOW.getTime() + 60_000).toISOString(),
  ...overrides,
});

const baseArtwork: Partial<Artwork> = {
  id: 'art-1',
  title: 'Obra',
  edition_size: 5,
  available_quantity: 5,
};

describe('payment helpers', () => {
  it('maps EasyPay payment statuses to order outcomes', () => {
    expect(orderOutcome('paid')).toBe('paid');
    expect(orderOutcome('failed')).toBe('failed');
    expect(orderOutcome('deleted')).toBe('failed');
    expect(orderOutcome('error')).toBe('failed');
    expect(orderOutcome('pending')).toBe('pending');
    expect(orderOutcome('authorised')).toBe('pending');
  });

  it('reserves Multibanco for 48 h, MB WAY for 10 min and card for 30 min', () => {
    expect(reservationEnd('MB', NOW).getTime() - NOW.getTime()).toBe(48 * 3_600_000);
    expect(reservationEnd('MBW', NOW).getTime() - NOW.getTime()).toBe(10 * 60_000);
    expect(reservationEnd('CC', NOW).getTime() - NOW.getTime()).toBe(30 * 60_000);
  });

  it('counts free copies as remaining minus reserved, never below 0', () => {
    expect(freeCopies({ available_quantity: 3, edition_size: 5 }, 1)).toBe(2);
    expect(freeCopies({ available_quantity: 1, edition_size: 1 }, 1)).toBe(0);
    expect(freeCopies({ available_quantity: 1, edition_size: 1 }, 3)).toBe(0);
  });
});

describe('syncArtOrder', () => {
  beforeEach(() => {
    mockGetSinglePayment.mockReset();
    mockSendEmail.mockReset();
  });

  it('marks a paid order paid, takes one copy and emails buyer and gallery', async () => {
    const { payload, orders, artworks } = fakePayload(baseOrder(), { ...baseArtwork });
    mockGetSinglePayment.mockResolvedValue({ id: 'ep-1', payment_status: 'paid' });

    const result = await syncArtOrder(payload, orders['order-1'], { force: true, now: NOW });

    expect(result.status).toBe('paid');
    expect(artworks['art-1'].available_quantity).toBe(4);
    expect(mockSendEmail).toHaveBeenCalledTimes(2);
  });

  it('applies a payment only once when confirmed twice at the same time', async () => {
    const { payload, orders, artworks } = fakePayload(baseOrder(), { ...baseArtwork });
    mockGetSinglePayment.mockResolvedValue({ id: 'ep-1', payment_status: 'paid' });
    const snapshot = structuredClone(orders['order-1']);

    await Promise.all([
      syncArtOrder(payload, snapshot, { force: true, now: NOW }),
      syncArtOrder(payload, structuredClone(snapshot), { force: true, now: NOW }),
    ]);

    expect(artworks['art-1'].available_quantity).toBe(4);
    expect(mockSendEmail).toHaveBeenCalledTimes(2);
  });

  it('marks a failed payment failed without touching the stock', async () => {
    const { payload, orders, artworks } = fakePayload(baseOrder(), { ...baseArtwork });
    mockGetSinglePayment.mockResolvedValue({ id: 'ep-1', payment_status: 'failed' });

    const result = await syncArtOrder(payload, orders['order-1'], { force: true, now: NOW });

    expect(result.status).toBe('failed');
    expect(artworks['art-1'].available_quantity).toBe(5);
  });

  it('expires a still-pending order once its reservation is over', async () => {
    const overdue = baseOrder({ reserved_until: new Date(NOW.getTime() - 1).toISOString() });
    const { payload, orders } = fakePayload(overdue, { ...baseArtwork });
    mockGetSinglePayment.mockResolvedValue({ id: 'ep-1', payment_status: 'pending' });

    const result = await syncArtOrder(payload, orders['order-1'], { force: true, now: NOW });

    expect(result.status).toBe('expired');
  });

  it('leaves the order untouched when EasyPay cannot be reached', async () => {
    const { payload, orders, artworks } = fakePayload(baseOrder(), { ...baseArtwork });
    mockGetSinglePayment.mockRejectedValue(new Error('timeout'));

    const result = await syncArtOrder(payload, orders['order-1'], { force: true, now: NOW });

    expect(result.status).toBe('pending');
    expect(artworks['art-1'].available_quantity).toBe(5);
  });

  it('does not re-check EasyPay more than once every few seconds', async () => {
    const recentlyChecked = baseOrder({
      last_checked_at: new Date(NOW.getTime() - 2_000).toISOString(),
    });
    const { payload, orders } = fakePayload(recentlyChecked, { ...baseArtwork });

    await syncArtOrder(payload, orders['order-1'], { now: NOW });

    expect(mockGetSinglePayment).not.toHaveBeenCalled();
  });
});

describe('order emails', () => {
  beforeEach(() => {
    mockGetSinglePayment.mockReset();
    mockSendEmail.mockReset();
  });

  it('sends the buyer the order link and the gallery the buyer details when an order is created', async () => {
    const order = {
      ...baseOrder(),
      artwork: { id: 'art-1', title: 'Obra' },
      artwork_reference: 'GA-TEST',
      base_value: 100,
      vat_rate: 23,
      vat_value: 23,
      payment_method: 'MB',
      buyer: {
        name: 'Ana',
        email: 'ana@example.com',
        nif: '123456789',
        address: 'Rua 1',
        postal_code_city: '6400 Pinhel',
      },
    } as unknown as ArtOrder;
    const { payload } = fakePayload(baseOrder(), { ...baseArtwork });

    await sendOrderCreatedEmails(payload, order, {
      orderUrl: 'https://hawkstars.org/pt/art/order/ENC-TEST?token=abc',
      galleryEmail: 'galeria@example.com',
    });

    const [toBuyer, toGallery] = mockSendEmail.mock.calls.map(([, email]) => email);
    expect(toBuyer.to).toBe('ana@example.com');
    expect(toBuyer.replyTo).toBe('galeria@example.com');
    expect(toBuyer.subject).toBe('Encomenda ENC-TEST registada — Obra');
    expect(toBuyer.text).toContain('https://hawkstars.org/pt/art/order/ENC-TEST?token=abc');
    expect(toGallery.to).toBe('galeria@example.com');
    expect(toGallery.replyTo).toBe('ana@example.com');
    expect(toGallery.text).toContain('NIF 123456789');
    expect(toGallery.text).toContain('Rua 1, 6400 Pinhel');
  });

  it('confirms the payment to the buyer and tells the gallery the copies left', async () => {
    const { payload, orders } = fakePayload(baseOrder(), { ...baseArtwork, reference: 'GA-TEST' });
    mockGetSinglePayment.mockResolvedValue({ id: 'ep-1', payment_status: 'paid' });

    await syncArtOrder(payload, orders['order-1'], { force: true, now: NOW });

    const [toBuyer, toGallery] = mockSendEmail.mock.calls.map(([, email]) => email);
    expect(toBuyer.to).toBe('ana@example.com');
    expect(toBuyer.subject).toBe('Pagamento confirmado — encomenda ENC-TEST');
    expect(toGallery.to).toBe('gallery@example.com');
    expect(toGallery.subject).toBe('PAGA: encomenda ENC-TEST — Obra');
    expect(toGallery.text).toContain('exemplares restantes: 4');
  });
});
