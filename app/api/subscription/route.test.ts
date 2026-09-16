import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from 'vitest';
import { POST } from './route';
import { SubscriptionPaymentQuery } from '@/types/payment/easypay';
import { resetRateLimit } from '@/utils/rateLimit';

vi.mock('uuid', () => ({
  v4: () => 'test-uuid-sub-5678',
}));

const { mockPayloadCreate } = vi.hoisted(() => ({ mockPayloadCreate: vi.fn() }));

vi.mock('@/lib/payload/server', () => ({
  getPayloadConfig: vi.fn().mockResolvedValue({ create: mockPayloadCreate }),
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
function getFetchCallArgs<T = Record<string, unknown>>(
  fetchMock: MockInstance
): { url: string; method: string; body: T; headers: Record<string, string> } {
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
    resetRateLimit();
    mockPayloadCreate.mockReset();
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
      const fetchMock = vi
        .spyOn(global, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify(easyPayResponse), { status: 200 }));

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
      const fetchMock = vi
        .spyOn(global, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'sub-check' }), { status: 200 }));

      const request = makeRequest({
        value: 15,
        email: 'check@example.com',
        name: 'Check Sub',
        plan: 'monthly',
        reason: 'Monthly support',
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

    it('defaults to the monthly plan', async () => {
      const fetchMock = vi
        .spyOn(global, 'fetch')
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 'sub-default-freq' }), { status: 200 })
        );

      await POST(makeRequest({ value: 10, email: 'default@example.com', name: 'Default Freq' }));

      const { body } = getFetchCallArgs<SubscriptionPaymentQuery>(fetchMock);
      expect(body.frequency).toBe('1M');
      expect(body.unlimited_payments).toBe(true);
      expect(body.capture_now).toBe(true);
      expect(body.max_captures).toBeUndefined();
    });

    it('maps each named plan to its frequency', async () => {
      for (const [plan, frequency] of [
        ['monthly', '1M'],
        ['quarterly', '3M'],
        ['yearly', '1Y'],
      ] as const) {
        resetRateLimit();
        const fetchMock = vi
          .spyOn(global, 'fetch')
          .mockResolvedValueOnce(
            new Response(JSON.stringify({ id: `sub-${plan}` }), { status: 200 })
          );

        const response = await POST(
          makeRequest({ value: 10, email: 'plan@example.com', name: 'Plan User', plan })
        );

        expect(response.status).toBe(200);
        const { body } = getFetchCallArgs<SubscriptionPaymentQuery>(fetchMock);
        expect(body.frequency).toBe(frequency);
        fetchMock.mockRestore();
      }
    });

    it('ignores caller-supplied recurrence fields', async () => {
      // These used to be read straight from the body and forwarded to EasyPay,
      // so a crafted request could create an unlimited *daily* charge starting
      // at an arbitrary time. They must now have no effect at all.
      const fetchMock = vi
        .spyOn(global, 'fetch')
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 'sub-ignored' }), { status: 200 })
        );

      await POST(
        makeRequest({
          value: 10,
          email: 'hostile@example.com',
          name: 'Hostile',
          frequency: '1D',
          start_time: '2020-01-01 00:00',
          capture_now: false,
          max_captures: 9999,
          unlimited_payments: false,
        })
      );

      const { body } = getFetchCallArgs<SubscriptionPaymentQuery>(fetchMock);
      expect(body.frequency).toBe('1M');
      expect(body.capture_now).toBe(true);
      expect(body.unlimited_payments).toBe(true);
      expect(body.max_captures).toBeUndefined();
      expect(body.start_time).not.toBe('2020-01-01 00:00');
    });

    it('records the subscription as an unconfirmed contribution', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'sub-persist' }), { status: 200 })
      );

      await POST(makeRequest({ value: 25, email: 'persist@example.com', name: 'Persist User' }));

      expect(mockPayloadCreate).toHaveBeenCalledOnce();
      const createCall = mockPayloadCreate.mock.calls[0][0];
      expect(createCall.collection).toBe('contributions');
      expect(createCall.data.value).toBe(25);
      expect(createCall.data.is_confirmed).toBe(false);
      expect(createCall.data.transaction_key).toBe('test-uuid-sub-5678');
      expect(createCall.data.extra_info.subscription).toBe(true);
    });

    it('still returns 200 when persisting the contribution fails', async () => {
      // The subscription already exists at EasyPay; failing the request would
      // tell the donor otherwise.
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'sub-dberr' }), { status: 200 })
      );
      mockPayloadCreate.mockRejectedValueOnce(new Error('DB down'));

      const response = await POST(
        makeRequest({ value: 10, email: 'dberr@example.com', name: 'DB Err' })
      );
      expect(response.status).toBe(200);
    });

    it('generates a default descriptive when no reason is provided', async () => {
      const fetchMock = vi
        .spyOn(global, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'sub-desc' }), { status: 200 }));

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

      expect(response.status).toBe(400);
    });

    it('returns 400 when the plan is not one we offer', async () => {
      const request = makeRequest({
        value: 10,
        email: 'donor@example.com',
        name: 'John Doe',
        plan: 'daily',
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
