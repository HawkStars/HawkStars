import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from 'vitest';
import { POST } from './route';
import { SinglePaymentQuery } from '@/types/payment/easypay';

// Mock uuid so transaction keys are predictable in tests
vi.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

const ENV_VARS = {
  EASYPAY_ACCOUNT_ID: 'test-account-id',
  EASYPAY_API_KEY: 'test-api-key',
  EASYPAY_API_URL: 'https://api.test.easypay.pt/2.0',
};

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/donate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** Returns the URL, method, headers and strongly-typed parsed body from the first fetch call. */
function getFetchCallArgs<T = Record<string, unknown>>(fetchMock: MockInstance): { url: string; method: string; body: T; headers: Record<string, string> } {
  const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
  return {
    url,
    method: options.method ?? '',
    body: JSON.parse(options.body as string) as T,
    headers: (options.headers ?? {}) as Record<string, string>,
  };
}

describe('POST /api/donate', () => {
  beforeEach(() => {
    process.env.EASYPAY_ACCOUNT_ID = ENV_VARS.EASYPAY_ACCOUNT_ID;
    process.env.EASYPAY_API_KEY = ENV_VARS.EASYPAY_API_KEY;
    process.env.EASYPAY_API_URL = ENV_VARS.EASYPAY_API_URL;
  });

  afterEach(() => {
    delete process.env.EASYPAY_ACCOUNT_ID;
    delete process.env.EASYPAY_API_KEY;
    delete process.env.EASYPAY_API_URL;
    vi.restoreAllMocks();
  });

  describe('successful donations', () => {
    it('processes a CC payment and returns EasyPay response', async () => {
      const easyPayResponse = { id: 'ep-123', status: 'success', method: { url: 'https://pay.easypay.pt/ep-123' } };
      const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify(easyPayResponse), { status: 200 })
      );

      const request = makeRequest({
        value: 10,
        paymentType: 'CC',
        email: 'donor@example.com',
        name: 'John Doe',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(easyPayResponse);

      expect(fetchMock).toHaveBeenCalledOnce();
      const { url, method, headers } = getFetchCallArgs(fetchMock);
      expect(url).toBe(`${ENV_VARS.EASYPAY_API_URL}/single`);
      expect(method).toBe('POST');
      expect(headers['AccountId']).toBe(ENV_VARS.EASYPAY_ACCOUNT_ID);
      expect(headers['ApiKey']).toBe(ENV_VARS.EASYPAY_API_KEY);
    });

    it('processes a MB payment', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'ep-mb-456', method: { entity: '12345', reference: '000 000 001' } }), {
          status: 200,
        })
      );

      const request = makeRequest({
        value: 25,
        paymentType: 'MB',
        email: 'donor@example.com',
        name: 'Jane Doe',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('processes a MBW payment', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'ep-mbw-789' }), { status: 200 })
      );

      const request = makeRequest({
        value: 5,
        paymentType: 'MBW',
        email: 'donor@example.com',
        name: 'Bob Smith',
        phone_number: '912345678',
        phone_indicative: '+351',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('sends the correct request body to EasyPay including customer data', async () => {
      const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'ep-check' }), { status: 200 })
      );

      const request = makeRequest({
        value: 50,
        paymentType: 'CC',
        email: 'check@example.com',
        name: 'Check User',
        phone_number: '910000000',
        phone_indicative: '+351',
        reason: 'Test donation reason',
      });

      await POST(request);

      const { body: sentBody } = getFetchCallArgs<SinglePaymentQuery>(fetchMock);
      expect(sentBody.type).toBe('sale');
      expect(sentBody.value).toBe(50);
      expect(sentBody.method).toBe('CC');
      expect(sentBody.currency).toBe('EUR');
      expect(sentBody.key).toBe('test-uuid-1234');
      expect(sentBody.customer?.name).toBe('Check User');
      expect(sentBody.customer?.email).toBe('check@example.com');
      expect(sentBody.customer?.phone).toBe('910000000');
      expect(sentBody.customer?.phone_indicative).toBe('+351');
      expect(sentBody.customer?.key).toBe('check@example.com');
      expect(sentBody.customer?.language).toBe('PT');
      expect(sentBody.capture?.descriptive).toBe('Test donation reason');
      expect(sentBody.capture?.transaction_key).toBe('test-uuid-1234');
      expect(sentBody.notification?.customer_method_instructions_email).toBe(true);
    });

    it('uses email as customer key', async () => {
      const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'ep-key-check' }), { status: 200 })
      );

      const request = makeRequest({
        value: 15,
        paymentType: 'MB',
        email: 'key@example.com',
        name: 'Key User',
      });

      await POST(request);

      const { body: sentBody } = getFetchCallArgs<SinglePaymentQuery>(fetchMock);
      expect(sentBody.customer?.key).toBe('key@example.com');
    });

    it('generates a default descriptive if no reason is provided', async () => {
      const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'ep-desc' }), { status: 200 })
      );

      const request = makeRequest({
        value: 20,
        paymentType: 'CC',
        email: 'nodesc@example.com',
        name: 'No Desc User',
      });

      await POST(request);

      const { body: sentBody } = getFetchCallArgs<SinglePaymentQuery>(fetchMock);
      expect(sentBody.capture?.descriptive).toContain('Donation - No Desc User');
    });
  });

  describe('validation errors', () => {
    it('returns 400 when required fields are missing', async () => {
      const request = makeRequest({ value: 10 });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid request data');
      expect(data.details).toBeDefined();
    });

    it('returns 400 when paymentType is invalid', async () => {
      const request = makeRequest({
        value: 10,
        paymentType: 'INVALID',
        email: 'donor@example.com',
        name: 'John Doe',
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('returns 400 when email is invalid', async () => {
      const request = makeRequest({
        value: 10,
        paymentType: 'CC',
        email: 'not-an-email',
        name: 'John Doe',
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('returns 400 when value is not positive', async () => {
      const request = makeRequest({
        value: -5,
        paymentType: 'CC',
        email: 'donor@example.com',
        name: 'John Doe',
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('returns 400 when name is empty', async () => {
      const request = makeRequest({
        value: 10,
        paymentType: 'CC',
        email: 'donor@example.com',
        name: '',
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe('missing environment variables', () => {
    it('returns 500 when EASYPAY_ACCOUNT_ID is missing', async () => {
      delete process.env.EASYPAY_ACCOUNT_ID;

      const request = makeRequest({
        value: 10,
        paymentType: 'CC',
        email: 'donor@example.com',
        name: 'John Doe',
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });

    it('returns 500 when EASYPAY_API_KEY is missing', async () => {
      delete process.env.EASYPAY_API_KEY;

      const request = makeRequest({
        value: 10,
        paymentType: 'CC',
        email: 'donor@example.com',
        name: 'John Doe',
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });

    it('returns 500 when EASYPAY_API_URL is missing', async () => {
      delete process.env.EASYPAY_API_URL;

      const request = makeRequest({
        value: 10,
        paymentType: 'CC',
        email: 'donor@example.com',
        name: 'John Doe',
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });
  });

  describe('EasyPay API errors', () => {
    it('returns error response when EasyPay API returns non-ok status', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      );

      const request = makeRequest({
        value: 10,
        paymentType: 'CC',
        email: 'donor@example.com',
        name: 'John Doe',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Error processing payment');
    });

    it('returns 500 when fetch throws an unexpected error', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      const request = makeRequest({
        value: 10,
        paymentType: 'CC',
        email: 'donor@example.com',
        name: 'John Doe',
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });
  });
});
