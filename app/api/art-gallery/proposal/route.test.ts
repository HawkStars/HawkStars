import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockCreate, mockSendEmail } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockSendEmail: vi.fn(),
}));

vi.mock('@/lib/payload/server', () => ({
  getPayloadConfig: vi.fn().mockResolvedValue({ create: mockCreate, sendEmail: mockSendEmail }),
}));
vi.mock('@/lib/payload/queries/artwork', () => ({
  getGallerySettings: vi.fn().mockResolvedValue({ contact_email: 'galeria@example.com' }),
}));
vi.mock('@/payload/utilities/collections/createNotification', () => ({
  createNotification: vi.fn(),
}));
vi.mock('@/payload/collections/ArtistProposal', () => ({
  ARTIST_PROPOSAL_COLLECTION: 'artist_proposals',
}));
vi.mock('@sentry/nextjs', () => ({ captureException: vi.fn() }));

import { POST } from './route';
import { resetRateLimit } from '@/utils/rateLimit';

const valid = {
  name: 'Ana Artista',
  email: 'ana@example.com',
  discipline: 'painting',
  portfolio_url: 'https://drive.google.com/obras',
  message: 'Proponho três pinturas a óleo.',
  consent: true,
};

const post = (body: unknown) =>
  POST(
    new Request('http://localhost/api/art-gallery/proposal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  );

describe('POST /api/art-gallery/proposal', () => {
  beforeEach(() => {
    resetRateLimit();
    mockCreate.mockReset().mockResolvedValue({ id: 'proposal-1' });
    mockSendEmail.mockReset().mockResolvedValue(undefined);
  });

  it('saves the proposal and emails the gallery, replying to the artist', async () => {
    const response = await post(valid);

    expect(response.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'artist_proposals',
        data: expect.objectContaining({ name: 'Ana Artista', status: 'new' }),
      })
    );
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    const email = mockSendEmail.mock.calls[0][0];
    expect(email.to).toBe('galeria@example.com');
    expect(email.replyTo).toBe('ana@example.com');
    expect(email.subject).toBe('Nova proposta de artista — Ana Artista');
    expect(email.text).toContain('Categoria: Pintura');
    expect(email.text).toContain('https://drive.google.com/obras');
    expect(email.text).toContain('Proponho três pinturas a óleo.');
  });

  it('does not store the consent flag itself', async () => {
    await post(valid);
    expect(mockCreate.mock.calls[0][0].data).not.toHaveProperty('consent');
  });

  it.each([
    ['without consent', { ...valid, consent: false }],
    ['with an invalid link', { ...valid, portfolio_url: 'not-a-link' }],
    ['with an unknown category', { ...valid, discipline: 'poetry' }],
    ['without a message', { ...valid, message: '' }],
  ])('rejects a proposal %s', async (_, body) => {
    const response = await post(body);
    expect(response.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('still accepts the proposal if the email cannot be sent', async () => {
    mockSendEmail.mockRejectedValue(new Error('SMTP down'));
    const response = await post(valid);
    expect(response.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });
});
