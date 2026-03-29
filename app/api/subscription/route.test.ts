import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from 'vitest';
import { POST } from './route';
import { SubscriptionPaymentQuery } from '@/types/payment/easypay';

vi.mock('uuid', () => ({
  v4: () => 'test-uuid-sub-5678',
}));

const ENV_VARS = {
  EASYPAY_ACCOUNT_ID: 'test-account-id',
  EASYPAY_API_KEY: 'test-api-key',
  EASYPAY_API_URL: 'https://api.test.easypay.pt/2.0',
};

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/subscription', {
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

describe('POST /api/subscription', () => {
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

  describe('successful subscriptions', () => {
    it('creates a subscription and returns EasyPay response', async () => {
      const easyPayResponse = { id: 'sub-123', status: 'active' };
      const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify(easyPayResponse), { status: 200 })
      );

      const request = makeRequest({
        value: 20,
        email: 'subscriber@example.com',
        name: 'Sub User',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(easyPayResponse);

      const { url, method, headers } = getFetchCallArgs<SubscriptionPaymentQuery>(fetchMock);
      expect(url).toBe(`${ENV_VARS.EASYPAY_API_URL}/subscription`);
      expect(method).toBe('POST');
      expect(headers['AccountId']).toBe(ENV_VARS.EASYPAY_ACCOUNT_ID);
      expect(headers['ApiKey']).toBe(ENV_VARS.EASYPAY_API_KEY);
    });

    it('sends the correct request body to EasyPay', async () => {
      const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'sub-check' }), { status: 200 })
      );

      const request = makeRequest({
        value: 15,
        email: 'check@example.com',
        name: 'Check Sub',
        frequency: '1M',
        reason: 'Monthly support',
        capture_now: true,
        unlimited_payments: true,
      });

      await POST(request);

      const { body: sentBody } = getFetchCallArgs<SubscriptionPaymentQuery>(fetchMock);
      expect(sentBody.value).toBe(15);
      expect(sentBody.currency).toBe('EUR');
      expect(sentBody.frequency).toBe('1M');
      expect(sentBody.method).toBe('CC');
      expect(sentBody.key).toBe('test-uuid-sub-5678');
      expect(sentBody.capture_now).toBe(true);
      expect(sentBody.retries).toBe(3);
      expect(sentBody.failover).toBe(false);
      expect(sentBody.unlimited_payments).toBe(true);
      expect(sentBody.customer.name).toBe('Check Sub');
      expect(sentBody.customer.email).toBe('check@example.com');
      expect(sentBody.customer.key).toBe('check@example.com');
      expect(sentBody.customer.language).toBe('PT');
      expect(sentBody.capture.transaction_key).toBe('test-uuid-sub-5678');
      expect(sentBody.capture.descriptive).toBe('Monthly support');
    });

    it('uses 1M as the default frequency', async () => {
      const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'sub-default-freq' }), { status: 200 })
      );

      const request = makeRequest({
        value: 10,
        email: 'default@example.com',
        name: 'Default Freq',
      });

      await POST(request);

      const { body: sentBody1 } = getFetchCallArgs<SubscriptionPaymentQuery>(fetchMock);
      expect(sentBody1.frequency).toBe('1M');
    });

    it('defaults to unlimited_payments: true', async () => {
      const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'sub-unlimited' }), { status: 200 })
      );

      const request = makeRequest({
        value: 10,
        email: 'unlimited@example.com',
        name: 'Unlimited User',
      });

      await POST(request);

      const { body: sentBody2 } = getFetchCallArgs<SubscriptionPaymentQuery>(fetchMock);
      expect(sentBody2.unlimited_payments).toBe(true);
    });

    it('includes max_captures when unlimited_payments is false', async () => {
      const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'sub-max' }), { status: 200 })
      );

      const request = makeRequest({
        value: 10,
        email: 'maxcap@example.com',
        name: 'Max Cap User',
        unlimited_payments: false,
        max_captures: 12,
      });

      await POST(request);

      const { body: sentBody3 } = getFetchCallArgs<SubscriptionPaymentQuery>(fetchMock);
      expect(sentBody3.unlimited_payments).toBe(false);
      expect(sentBody3.max_captures).toBe(12);
    });

    it('does not include max_captures when unlimited_payments is true', async () => {
      const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'sub-no-max' }), { status: 200 })
      );

      const request = makeRequest({
        value: 10,
        email: 'nomax@example.com',
        name: 'No Max User',
        unlimited_payments: true,
        max_captures: 12,
      });

      await POST(request);

      const { body: sentBody4 } = getFetchCallArgs<SubscriptionPaymentQuery>(fetchMock);
      expect(sentBody4.max_captures).toBeUndefined();
    });

    it('accepts all valid frequency values', async () => {
      const frequencies = ['1D', '1W', '2W', '1M', '2M', '3M', '4M', '6M', '1Y', '2Y', '3Y'];

      for (const frequency of frequencies) {
        vi.spyOn(global, 'fetch').mockResolvedValueOnce(
          new Response(JSON.stringify({ id: `sub-${frequency}` }), { status: 200 })
        );

        const request = makeRequest({
          value: 10,
          email: 'freq@example.com',
          name: 'Freq User',
          frequency,
        });

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });

    it('uses provided start_time', async () => {
      const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'sub-start' }), { status: 200 })
      );

      const customStartTime = '2025-06-01 10:00';
      const request = makeRequest({
        value: 10,
        email: 'start@example.com',
        name: 'Start User',
        start_time: customStartTime,
      });

      await POST(request);

      const { body: sentBody5 } = getFetchCallArgs<SubscriptionPaymentQuery>(fetchMock);
      expect(sentBody5.start_time).toBe(customStartTime);
    });

    it('generates a default descriptive when no reason is provided', async () => {
      const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'sub-desc' }), { status: 200 })
      );

      const request = makeRequest({
        value: 10,
        email: 'nodesc@example.com',
        name: 'No Desc Sub',
      });

      await POST(request);

      const { body: sentBody6 } = getFetchCallArgs<SubscriptionPaymentQuery>(fetchMock);
      expect(sentBody6.capture.descriptive).toContain('Monthly Donation - No Desc Sub');
    });
  });

  describe('validation errors', () => {
    it('returns 400 when required fields are missing', async () => {
      const request = makeRequest({ value: 10 });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid request data');
    });

    it('returns 400 when frequency is invalid', async () => {
      const request = makeRequest({
        value: 10,
        email: 'donor@example.com',
        name: 'John Doe',
        frequency: 'INVALID',
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('returns 400 when value is not positive', async () => {
      const request = makeRequest({
        value: 0,
        email: 'donor@example.com',
        name: 'John Doe',
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
        new Response(JSON.stringify({ error: 'Payment method not supported' }), { status: 422 })
      );

      const request = makeRequest({
        value: 10,
        email: 'donor@example.com',
        name: 'John Doe',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.error).toBe('Error creating subscription');
    });

    it('returns 500 when fetch throws an unexpected error', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      const request = makeRequest({
        value: 10,
        email: 'donor@example.com',
        name: 'John Doe',
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });
  });
});
