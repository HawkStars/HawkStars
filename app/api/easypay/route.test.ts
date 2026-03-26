import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.mock is hoisted to the top of the file - use vi.hoisted for variables referenced inside the factory
const { mockPayloadCreate, mockPayloadFind, mockPayloadUpdate } = vi.hoisted(() => ({
  mockPayloadCreate: vi.fn(),
  mockPayloadFind: vi.fn(),
  mockPayloadUpdate: vi.fn(),
}));

vi.mock('@/lib/payload/server', () => ({
  getPayloadConfig: vi.fn().mockResolvedValue({
    create: mockPayloadCreate,
    find: mockPayloadFind,
    update: mockPayloadUpdate,
  }),
}));

import { POST } from './route';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/easypay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/easypay (webhook)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('invalid payload', () => {
    it('returns 400 when body is missing an id', async () => {
      const request = makeRequest({ type: 'capture', status: 'success' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid payload');
    });

    it('returns 400 for an empty object', async () => {
      const request = makeRequest({});
      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });

  describe('authorisation notifications', () => {
    const authorisationPayload = {
      id: 'auth-001',
      value: 50,
      currency: 'EUR',
      key: 'txn-key-abc',
      customer: {
        id: 'cust-001',
        name: 'Maria Silva',
        email: 'maria@example.com',
      },
      method: 'cc',
      account: { id: 'acct-001' },
      authorisation: { id: 'auth-id-xyz' },
    };

    it('creates a contribution record with is_confirmed: false', async () => {
      const request = makeRequest(authorisationPayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPayloadCreate).toHaveBeenCalledOnce();

      const createCall = mockPayloadCreate.mock.calls[0][0];
      expect(createCall.collection).toBe('contributions');
      expect(createCall.data.donor).toBe('Maria Silva');
      expect(createCall.data.value).toBe(50);
      expect(createCall.data.is_confirmed).toBe(false);
      expect(createCall.data.contribution_type).toBe('BANK');
      expect(createCall.data.extra_info).toContain('CC');
      expect(createCall.data.extra_info).toContain('auth-id-xyz');
    });

    it('sets is_anonymous: false when customer name is present', async () => {
      const request = makeRequest(authorisationPayload);
      await POST(request);

      const createCall = mockPayloadCreate.mock.calls[0][0];
      expect(createCall.data.is_anonymous).toBe(false);
    });

    it('uses "Anonymous" and is_anonymous: true when customer name is absent', async () => {
      const anonymousPayload = {
        ...authorisationPayload,
        customer: { id: 'cust-002', name: '', email: 'anon@example.com' },
      };

      const request = makeRequest(anonymousPayload);
      await POST(request);

      const createCall = mockPayloadCreate.mock.calls[0][0];
      expect(createCall.data.donor).toBe('Anonymous');
      expect(createCall.data.is_anonymous).toBe(true);
    });

    it('falls back to notification id when authorisation id is absent', async () => {
      const payloadWithoutAuthId = {
        ...authorisationPayload,
        authorisation: null as unknown as { id: string },
      };

      const request = makeRequest(payloadWithoutAuthId);
      await POST(request);

      const createCall = mockPayloadCreate.mock.calls[0][0];
      expect(createCall.data.extra_info).toContain('auth-001');
    });

    it('returns 200 even when Payload create throws an error', async () => {
      mockPayloadCreate.mockRejectedValueOnce(new Error('DB error'));

      const request = makeRequest(authorisationPayload);
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect((await response.json()).success).toBe(true);
    });
  });

  describe('transaction notifications', () => {
    const transactionPayload = {
      id: 'txn-001',
      key: 'txn-key-abc',
      type: 'capture',
      status: 'success',
      messages: [],
      date: '2024-01-01T00:00:00.000Z',
      value: 50,
      currency: 'EUR',
      method: 'cc',
    };

    const existingContribution = { id: 'contrib-001', extra_info: 'txn-key-abc' };

    beforeEach(() => {
      mockPayloadFind.mockResolvedValue({ docs: [existingContribution] });
    });

    it('updates contribution to is_confirmed: true on success', async () => {
      const request = makeRequest(transactionPayload);
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPayloadFind).toHaveBeenCalledOnce();
      expect(mockPayloadUpdate).toHaveBeenCalledOnce();

      const updateCall = mockPayloadUpdate.mock.calls[0][0];
      expect(updateCall.id).toBe('contrib-001');
      expect(updateCall.data.is_confirmed).toBe(true);
    });

    it('updates contribution to is_confirmed: false on failure', async () => {
      const failedPayload = { ...transactionPayload, status: 'failed' };

      const request = makeRequest(failedPayload);
      await POST(request);

      const updateCall = mockPayloadUpdate.mock.calls[0][0];
      expect(updateCall.data.is_confirmed).toBe(false);
    });

    it('does not update contribution when status is pending', async () => {
      const pendingPayload = { ...transactionPayload, status: 'pending' };

      const request = makeRequest(pendingPayload);
      await POST(request);

      expect(mockPayloadUpdate).not.toHaveBeenCalled();
    });

    it('warns but does not throw when no contribution is found', async () => {
      mockPayloadFind.mockResolvedValueOnce({ docs: [] });

      const request = makeRequest(transactionPayload);
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPayloadUpdate).not.toHaveBeenCalled();
    });

    it('finds contribution by transaction key in extra_info', async () => {
      const request = makeRequest(transactionPayload);
      await POST(request);

      const findCall = mockPayloadFind.mock.calls[0][0];
      expect(findCall.collection).toBe('contributions');
      expect(findCall.where.extra_info.contains).toBe('txn-key-abc');
      expect(findCall.limit).toBe(1);
    });

    it('returns 200 even when Payload update throws an error', async () => {
      mockPayloadUpdate.mockRejectedValueOnce(new Error('DB error'));

      const request = makeRequest(transactionPayload);
      const response = await POST(request);

      expect(response.status).toBe(200);
    });
  });

  describe('generic notifications', () => {
    const baseGenericPayload = {
      id: 'gen-001',
      key: 'txn-key-generic',
      type: 'capture',
      status: 'success',
      messages: [],
      date: '2024-01-01T00:00:00.000Z',
    };

    const existingContribution = { id: 'contrib-gen-001', extra_info: 'txn-key-generic' };

    it('updates contribution to is_confirmed: true on capture success', async () => {
      mockPayloadFind.mockResolvedValue({ docs: [existingContribution] });

      const request = makeRequest(baseGenericPayload);
      await POST(request);

      const updateCall = mockPayloadUpdate.mock.calls[0][0];
      expect(updateCall.data.is_confirmed).toBe(true);
    });

    it('updates contribution to is_confirmed: false on failed generic notification', async () => {
      mockPayloadFind.mockResolvedValue({ docs: [existingContribution] });
      const failedPayload = { ...baseGenericPayload, status: 'failed' };

      const request = makeRequest(failedPayload);
      await POST(request);

      const updateCall = mockPayloadUpdate.mock.calls[0][0];
      expect(updateCall.data.is_confirmed).toBe(false);
    });

    it('does not update contribution when capture type but status is pending', async () => {
      const pendingPayload = { ...baseGenericPayload, status: 'pending' };

      const request = makeRequest(pendingPayload);
      await POST(request);

      expect(mockPayloadUpdate).not.toHaveBeenCalled();
    });

    it('does not update contribution when type is not capture and status is success', async () => {
      const nonCapturePayload = { ...baseGenericPayload, type: 'single' };

      const request = makeRequest(nonCapturePayload);
      await POST(request);

      expect(mockPayloadUpdate).not.toHaveBeenCalled();
    });
  });

  describe('response format', () => {
    it('always returns 200 with success: true even on internal errors', async () => {
      // Force Payload to throw an error
      mockPayloadFind.mockRejectedValueOnce(new Error('Unexpected DB failure'));

      const transactionPayload = {
        id: 'err-001',
        key: 'txn-key-err',
        type: 'capture',
        status: 'success',
        messages: [],
        date: '2024-01-01T00:00:00.000Z',
        value: 10,
        currency: 'EUR',
      };

      const request = makeRequest(transactionPayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});
